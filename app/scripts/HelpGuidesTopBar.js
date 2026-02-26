(function (global) {
  "use strict";

  const HELP_GUIDES_APP_URL =
    "https://cbre.faciliosandbox.com.au/cbresandbox/maintenance/help-guides/help-guide-connected-app/753";
  const TOPBAR_TITLE = "Help Guides";
  const ROUTE_STOP_WORDS = new Set([
    "all",
    "list",
    "index",
    "overview",
    "summary",
    "view",
    "details",
    "maintenance",
    "cbresandbox",
    "building-meta-data",
    "help-guides",
    "help-guide-connected-app",
  ]);

  function normalizeText(value) {
    return String(value || "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function decodeSegment(value) {
    try {
      return decodeURIComponent(String(value || ""));
    } catch (_error) {
      return String(value || "");
    }
  }

  function extractSegmentFromUrl(urlText) {
    const rawUrl = String(urlText || "").trim();
    if (!rawUrl) {
      return "";
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(rawUrl, global.location.origin);
    } catch (_error) {
      return "";
    }

    const pathname = parsedUrl.pathname || "";
    const buildingMetaMatch = pathname.match(
      /\/building-meta-data\/([^/?#]+)(?:\/|$)/i
    );

    if (buildingMetaMatch && buildingMetaMatch[1]) {
      return normalizeText(decodeSegment(buildingMetaMatch[1]));
    }

    const segments = pathname.split("/").filter(Boolean);
    if (!segments.length) {
      return "";
    }

    for (let index = segments.length - 1; index >= 0; index -= 1) {
      const segment = segments[index];
      const normalizedSegment = String(segment).toLowerCase();

      if (!normalizedSegment || ROUTE_STOP_WORDS.has(normalizedSegment)) {
        continue;
      }

      if (/^\d+$/.test(normalizedSegment)) {
        continue;
      }

      return normalizeText(decodeSegment(segment));
    }

    return "";
  }

  function buildHelpGuidesUrl(searchText) {
    const query = normalizeText(searchText);
    const targetUrl = new URL(HELP_GUIDES_APP_URL);
    if (query) {
      targetUrl.searchParams.set("search", query);
    }
    return targetUrl.toString();
  }

  global.helpGuidesTopBarVm = new Vue({
    el: "#app",
    data: {
      user: null,
      loading: false,
      searchText: "",
      currentPageUrl: "",
    },
    created() {
      global.facilioApp = FacilioAppSDK.init();

      global.facilioApp.on("app.loaded", async () => {
        try {
          global.facilioApp.interface.trigger("setIcon", {
            iconGroup: "action",
            icon: "help",
          });
          global.facilioApp.interface.trigger("setTitle", { title: TOPBAR_TITLE });
          global.facilioApp.interface.trigger("showHeader", true);
          global.facilioApp.interface.trigger("resize", { height: 300 });
          global.facilioApp.interface.trigger("show");
        } catch (_error) {
          // Ignore UI trigger failures; core widget should still function.
        }

        await this.loadUser();
        await this.syncSearchFromCurrentPage();
      });

      global.facilioApp.on("topbar.active", async () => {
        await this.loadUser();
        await this.syncSearchFromCurrentPage();
      });
    },
    methods: {
      async getCurrentPageUrl() {
        try {
          if (
            global.facilioApp &&
            global.facilioApp.interface &&
            typeof global.facilioApp.interface.getCurrentPage === "function"
          ) {
            const result = global.facilioApp.interface.getCurrentPage();
            const pageData =
              result && typeof result.then === "function" ? await result : result;
            const pageUrl =
              pageData &&
              (pageData.url || pageData.href || pageData.currentPage || "");
            if (pageUrl) {
              return String(pageUrl);
            }
          }
        } catch (_error) {
          // Fall through to alternate sources.
        }

        const referrer =
          global.document && global.document.referrer
            ? String(global.document.referrer).trim()
            : "";
        if (referrer) {
          return referrer;
        }

        return global.location && global.location.href
          ? String(global.location.href)
          : "";
      },

      async syncSearchFromCurrentPage() {
        const pageUrl = await this.getCurrentPageUrl();
        this.currentPageUrl = pageUrl;

        const extracted = extractSegmentFromUrl(pageUrl);
        if (extracted) {
          this.searchText = extracted;
        }
      },

      async loadUser() {
        try {
          this.loading = true;
          const user = global.facilioApp.getCurrentUser();

          this.user = {
            name: (user && user.name) || "Unknown User",
            email: (user && user.email) || "No Email",
            roleName:
              (user && user.role && user.role.name) ||
              (user && user.roleName) ||
              "No Role",
          };
        } catch (error) {
          console.error("Error fetching current user:", error);
          this.user = {
            name: "Unknown User",
            email: "No Email",
            roleName: "No Role",
          };
        } finally {
          this.loading = false;
        }
      },

      getInitials(name) {
        const parts = String(name || "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);
        if (!parts.length) {
          return "";
        }
        return parts
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase();
      },

      async openHelpGuides() {
        const targetUrl = buildHelpGuidesUrl(this.searchText);

        try {
          if (
            global.facilioApp &&
            global.facilioApp.interface &&
            typeof global.facilioApp.interface.openURL === "function"
          ) {
            global.facilioApp.interface.openURL({
              url: targetUrl,
              target: "_blank",
            });
            return;
          }
        } catch (_error) {
          // Fallback below.
        }

        global.open(targetUrl, "_blank", "noopener,noreferrer");
      },
    },
  });
})(window);
