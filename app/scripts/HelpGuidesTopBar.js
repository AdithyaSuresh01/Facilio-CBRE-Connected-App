(function (global) {
  "use strict";

  const HELP_GUIDES_APP_URL =
    "https://cbre.faciliosandbox.com.au/cbresandbox/maintenance/help-guides/help-guide-connected-app/753";
  const TOPBAR_TITLE = "Help Guides";

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

    const segments = (parsedUrl.pathname || "").split("/").filter(Boolean);
    if (!segments.length) {
      return "";
    }

    const maintenanceIndex = segments.findIndex(
      (segment) => String(segment).toLowerCase() === "maintenance"
    );

    if (maintenanceIndex === -1) {
      return "";
    }

    const secondAfterMaintenance = segments[maintenanceIndex + 2];
    if (secondAfterMaintenance) {
      return normalizeText(decodeSegment(secondAfterMaintenance));
    }

    const firstAfterMaintenance = segments[maintenanceIndex + 1];
    if (firstAfterMaintenance) {
      return normalizeText(decodeSegment(firstAfterMaintenance));
    }

    return "";
  }

  function buildHelpGuidesUrl(searchText) {
    const query = normalizeText(searchText);
    const targetUrl = new URL(HELP_GUIDES_APP_URL);
    if (query) {
      targetUrl.searchParams.set("search", query);
      targetUrl.hash = "/?search=" + encodeURIComponent(query);
    }
    return targetUrl.toString();
  }

  function isMobileRuntime() {
    try {
      if (
        global.facilioApp &&
        typeof global.facilioApp.isMobile === "function"
      ) {
        return Boolean(global.facilioApp.isMobile());
      }
    } catch (_error) {
      // Fallback checks below.
    }

    const userAgent = String(
      (global.navigator && global.navigator.userAgent) || ""
    ).toLowerCase();
    return /(android|iphone|ipad|ipod|mobile|iemobile|opera mini)/i.test(
      userAgent
    );
  }

  global.helpGuidesTopBarVm = new Vue({
    el: "#app",
    data: {
      searchText: "",
      currentPageUrl: "",
      isDesktopMode: true,
    },
    updated() {
      this.refreshIcons();
    },
    created() {
      global.facilioApp = FacilioAppSDK.init();

      global.facilioApp.on("app.loaded", async () => {
        this.isDesktopMode = !isMobileRuntime();
        if (!this.isDesktopMode) {
          try {
            global.facilioApp.interface.trigger("hide");
          } catch (_error) {
            // no-op
          }
          return;
        }

        try {
          global.facilioApp.interface.trigger("setIcon", {
            iconGroup: "action",
            icon: "help",
          });
          global.facilioApp.interface.trigger("setTitle", { title: TOPBAR_TITLE });
          global.facilioApp.interface.trigger("showHeader", false);
          global.facilioApp.interface.trigger("resize", { height: 300 });
          global.facilioApp.interface.trigger("show");
        } catch (_error) {
          // Ignore UI trigger failures; core widget should still function.
        }

        await this.syncSearchFromCurrentPage();
        this.refreshIcons();
      });

      global.facilioApp.on("topbar.active", async () => {
        if (!this.isDesktopMode) {
          return;
        }
        await this.syncSearchFromCurrentPage();
        this.refreshIcons();
        try {
          global.facilioApp.interface.trigger("resize", { height: 300 });
        } catch (_error) {
          // no-op
        }
      });
    },
    methods: {
      refreshIcons() {
        if (global.lucide && typeof global.lucide.createIcons === "function") {
          this.$nextTick(() => {
            global.lucide.createIcons();
          });
        }
      },
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
            let pageUrl = "";
            if (typeof pageData === "string") {
              pageUrl = pageData;
            } else if (pageData && typeof pageData.url === "string") {
              pageUrl = pageData.url;
            } else if (
              pageData &&
              pageData.url &&
              typeof pageData.url.href === "string"
            ) {
              pageUrl = pageData.url.href;
            } else if (pageData && typeof pageData.href === "string") {
              pageUrl = pageData.href;
            } else if (pageData && typeof pageData.currentPage === "string") {
              pageUrl = pageData.currentPage;
            }
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

      async openHelpGuides() {
        if (!this.isDesktopMode) {
          return;
        }

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
