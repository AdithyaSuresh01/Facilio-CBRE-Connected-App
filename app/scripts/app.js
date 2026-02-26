(function (global) {
  "use strict";

  const DEFAULT_FILTER = "All";
  const DEFAULT_FACILIO_ORIGIN = "https://cbre.faciliosandbox.com.au";

  const isEmpty = (value) => {
    return (
      value === undefined ||
      value === null ||
      Number(value) === -1 ||
      (typeof value === "object" &&
        !(value instanceof Blob) &&
        Object.keys(value).length === 0) ||
      (typeof value === "string" && value.trim().length === 0)
    );
  };

  function getSlugFromHash(hashValue) {
    const hash = String(hashValue || "").replace(/^#/, "");
    if (!hash || hash === "/") {
      return null;
    }

    const match = hash.match(/^\/category\/([^/?#]+)/);
    if (!match) {
      return null;
    }

    return decodeURIComponent(match[1]);
  }

  function slugify(value, fallback) {
    const source = String(value || fallback || "category");
    return source
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function parseMapLikeString(value) {
    const text = String(value || "").trim();
    if (!text) {
      return {};
    }

    const trimmed = text.replace(/^\{/, "").replace(/\}$/, "");
    if (trimmed.indexOf("=") === -1) {
      return { name: text };
    }

    const output = {};
    const entries = trimmed.split(/,\s(?=[^,=]+\=)/g);

    entries.forEach((entry) => {
      const separatorIndex = entry.indexOf("=");
      if (separatorIndex === -1) {
        return;
      }

      const key = entry.slice(0, separatorIndex).trim();
      const mapValue = entry.slice(separatorIndex + 1).trim();
      if (!key) {
        return;
      }

      output[key] = mapValue;
    });

    return output;
  }

  function getSearchQueryFromUrl(searchValue) {
    const rawSearch = String(searchValue || "").trim();
    if (!rawSearch) {
      return "";
    }

    const queryParts = [];
    if (rawSearch.charAt(0) === "?") {
      queryParts.push(rawSearch.slice(1));
    }
    if (rawSearch.indexOf("?") !== -1) {
      queryParts.push(rawSearch.split("?").slice(1).join("?"));
    }
    if (rawSearch.indexOf("#") !== -1 && rawSearch.indexOf("?") !== -1) {
      const hashQuery = rawSearch.split("#").pop().split("?").slice(1).join("?");
      if (hashQuery) {
        queryParts.push(hashQuery);
      }
    }
    if (queryParts.length === 0) {
      queryParts.push(rawSearch);
    }

    for (let i = 0; i < queryParts.length; i += 1) {
      try {
        const params = new URLSearchParams(queryParts[i]);
        const query =
          params.get("search") || params.get("q") || params.get("query") || "";
        const normalized = String(query)
          .split("#")[0]
          .replace(/\s+/g, " ")
          .trim();
        if (normalized) {
          return normalized;
        }
      } catch (_error) {
        // Keep trying with other formats.
      }
    }

    const regexMatch = rawSearch.match(/[?&#](?:search|q|query)=([^&#]+)/i);
    if (regexMatch && regexMatch[1]) {
      let decoded = regexMatch[1];
      try {
        decoded = decodeURIComponent(regexMatch[1]);
      } catch (_error) {
        decoded = regexMatch[1];
      }
      return decoded.replace(/\+/g, " ").replace(/\s+/g, " ").trim();
    }

    return "";
  }

  function getSearchQueryFromObject(source) {
    if (!source || typeof source !== "object") {
      return "";
    }

    const directCandidates = [source.search, source.q, source.query];
    for (let index = 0; index < directCandidates.length; index += 1) {
      const candidate = directCandidates[index];
      if (typeof candidate === "string" || typeof candidate === "number") {
        const normalized = String(candidate).replace(/\s+/g, " ").trim();
        if (normalized) {
          return normalized;
        }
      }
    }

    if (source.query && typeof source.query === "object") {
      const nestedQuery = getSearchQueryFromObject(source.query);
      if (nestedQuery) {
        return nestedQuery;
      }
    }

    const urlCandidates = [
      source.url,
      source.href,
      source.currentPage,
      source.path,
      source.pathname,
      source.location,
    ];
    for (let index = 0; index < urlCandidates.length; index += 1) {
      const candidate = urlCandidates[index];
      if (typeof candidate === "string") {
        const fromUrl = getSearchQueryFromUrl(candidate);
        if (fromUrl) {
          return fromUrl;
        }
      } else if (candidate && typeof candidate === "object") {
        const fromObject = getSearchQueryFromObject(candidate);
        if (fromObject) {
          return fromObject;
        }
      }
    }

    const contextualQuery = getSearchQueryFromObject(source.context);
    if (contextualQuery) {
      return contextualQuery;
    }

    return "";
  }

  function getInitialDesktopSearchQuery(additionalSources) {
    const sources = [
      global && global.location ? global.location.search : "",
      global && global.location ? global.location.hash : "",
      global && global.location ? global.location.href : "",
      global && global.document ? global.document.referrer : "",
    ];
    if (Array.isArray(additionalSources) && additionalSources.length > 0) {
      sources.unshift.apply(sources, additionalSources);
    }

    for (let index = 0; index < sources.length; index += 1) {
      const source = sources[index];
      const query =
        typeof source === "string"
          ? getSearchQueryFromUrl(source)
          : getSearchQueryFromObject(source);
      if (query) {
        return query;
      }
    }

    return "";
  }

  function getFacilioOrigin() {
    const configuredOrigin = String(global.FACILIO_BASE_ORIGIN || "").trim();
    if (/^https?:\/\//i.test(configuredOrigin)) {
      return configuredOrigin.replace(/\/+$/, "");
    }

    try {
      const referrer = global.document && global.document.referrer
        ? String(global.document.referrer).trim()
        : "";
      if (referrer) {
        const referrerOrigin = new URL(referrer).origin;
        if (referrerOrigin && /facilio/i.test(referrerOrigin)) {
          return referrerOrigin.replace(/\/+$/, "");
        }
      }
    } catch (_error) {
      // Ignore invalid referrer URL parsing and use fallback below.
    }

    const locationOrigin =
      global &&
      global.location &&
      typeof global.location.origin === "string" &&
      global.location.origin
        ? global.location.origin
        : "";

    if (locationOrigin && /facilio/i.test(locationOrigin)) {
      return locationOrigin.replace(/\/+$/, "");
    }

    return DEFAULT_FACILIO_ORIGIN;
  }

  function resolveFacilioUrl(urlPath) {
    const raw = String(urlPath || "").trim();
    if (!raw) {
      return "";
    }

    if (/^https?:\/\//i.test(raw)) {
      return raw;
    }

    if (raw.startsWith("//")) {
      return "https:" + raw;
    }

    const facilioOrigin = getFacilioOrigin();

    if (raw.startsWith("/")) {
      return facilioOrigin + raw;
    }

    return facilioOrigin + "/" + raw.replace(/^\/+/, "");
  }

  function extractFileIdFromFacilioUrl(urlPath) {
    const raw = String(urlPath || "").trim();
    if (!raw) {
      return null;
    }

    const match = raw.match(/\/files\/(?:preview|download)\/(\d+)(?:[/?#]|$)/i);
    if (!match || !match[1]) {
      return null;
    }

    const id = Number(match[1]);
    return Number.isFinite(id) ? id : null;
  }

  function detectMobileBrowser() {
    const nav = global && global.navigator ? global.navigator : null;

    if (
      nav &&
      nav.userAgentData &&
      typeof nav.userAgentData.mobile === "boolean"
    ) {
      return nav.userAgentData.mobile;
    }

    const userAgent = String((nav && nav.userAgent) || "").toLowerCase();
    const mobileUserAgentPattern =
      /(android|webos|iphone|ipad|ipod|blackberry|bb10|iemobile|opera mini|mobile)/i;
    const hasMobileUserAgent = mobileUserAgentPattern.test(userAgent);

    const maxTouchPoints =
      nav && typeof nav.maxTouchPoints === "number" ? nav.maxTouchPoints : 0;
    const hasTouchSupport =
      maxTouchPoints > 1 || (global && "ontouchstart" in global);

    let isNarrowViewport = false;
    if (global && typeof global.matchMedia === "function") {
      isNarrowViewport = global.matchMedia("(max-width: 768px)").matches;
    } else {
      const viewportWidth =
        (global && global.innerWidth) ||
        (global &&
          global.document &&
          global.document.documentElement &&
          global.document.documentElement.clientWidth) ||
        1024;
      isNarrowViewport = viewportWidth <= 768;
    }

    return hasMobileUserAgent || (hasTouchSupport && isNarrowViewport);
  }

  function inferFileExtension(contentType, resourceType) {
    const normalizedContentType = String(contentType || "").toLowerCase();
    const normalizedType = String(resourceType || "").toLowerCase();

    if (normalizedContentType.includes("pdf")) {
      return "pdf";
    }

    if (normalizedContentType.startsWith("video/")) {
      const videoExt = normalizedContentType.split("/")[1] || "mp4";
      return videoExt.split(";")[0].trim() || "mp4";
    }

    if (normalizedContentType.startsWith("image/")) {
      const imageExt = normalizedContentType.split("/")[1] || "jpg";
      return imageExt.split(";")[0].trim() || "jpg";
    }

    if (normalizedType === "pdf") {
      return "pdf";
    }

    if (normalizedType === "video") {
      return "mp4";
    }

    return "txt";
  }

  function sanitizeFileBaseName(value) {
    const raw = String(value || "")
      .replace(/[\\/:*?"<>|]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!raw) {
      return "help_guide";
    }

    return raw.replace(/\s/g, "_");
  }

  function buildDownloadFileName(preferredName, title, contentType, resourceType) {
    const extension = inferFileExtension(contentType, resourceType);
    const preferred = String(preferredName || "").trim();

    if (preferred) {
      const safePreferred = preferred.replace(/[\\/:*?"<>|]+/g, "_").trim();
      if (/\.[a-z0-9]{2,6}$/i.test(safePreferred)) {
        return safePreferred;
      }
      return safePreferred + "." + extension;
    }

    return sanitizeFileBaseName(title) + "." + extension;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderInlineMarkdown(text) {
    return escapeHtml(text).replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-medium text-[#283648]">$1</strong>'
    );
  }

  function parseArticleContent(content) {
    const lines = String(content || "").split("\n");
    const blocks = [];

    let index = 0;
    let isFirstParagraph = true;

    while (index < lines.length) {
      const line = lines[index];

      if (line.startsWith("## ")) {
        blocks.push({ type: "heading", text: line.replace("## ", "") });
        index += 1;
        continue;
      }

      if (line.startsWith("- ")) {
        const items = [];
        while (index < lines.length && lines[index].startsWith("- ")) {
          items.push(lines[index].replace("- ", ""));
          index += 1;
        }
        blocks.push({ type: "bullets", items: items });
        continue;
      }

      if (line.startsWith("**Q:")) {
        const question = line.replace(/\*\*/g, "").replace("Q: ", "").replace("Q:", "");
        let answer = "";
        index += 1;

        if (index < lines.length && lines[index].startsWith("A:")) {
          answer = lines[index].replace("A: ", "").replace("A:", "");
          index += 1;
        }

        blocks.push({ type: "qa", question: question, answer: answer });
        continue;
      }

      if (line.startsWith("A:")) {
        blocks.push({ type: "paragraph", text: line });
        index += 1;
        continue;
      }

      if (line.trim() === "") {
        index += 1;
        continue;
      }

      blocks.push({
        type: "paragraph",
        text: line,
        isIntro: isFirstParagraph,
      });

      isFirstParagraph = false;
      index += 1;
    }

    return blocks;
  }

  function createOperationsHelpDeskApp(el) {
    return new Vue({
      el: el,
      data: {
        currentUser: null,
        isInternalUser: null,
        helpCategories: [],
        HelpGuides: [],
        guidesByCategory: {},
        searchQuery: getInitialDesktopSearchQuery(),
        hasAppliedSearchQueryPrefill: false,
        resourceSearchQuery: "",
        activeFilter: DEFAULT_FILTER,
        previewResource: null,
        selectedSlug: null,
        mobileDownloadInProgress: false,
        mobileToastVisible: false,
        mobileToastMessage: "",
        mobileToastTimer: null,
        mobileDownloadUnlockTimer: null,
      },
      computed: {
        categoryList() {
          return Array.isArray(this.helpCategories) ? this.helpCategories : [];
        },
        isLandingView() {
          return this.selectedSlug === null;
        },
        activeCategory() {
          if (!this.selectedSlug) {
            return null;
          }
          return this.categoryList.find((category) => category.slug === this.selectedSlug) || null;
        },
        activeResources() {
          if (!this.activeCategory) {
            return [];
          }

          const categoryId = String(this.activeCategory.id);
          const cachedGuides = this.guidesByCategory[categoryId];
          if (Array.isArray(cachedGuides)) {
            return cachedGuides;
          }

          if (Array.isArray(this.HelpGuides) && this.HelpGuides.length > 0) {
            return this.HelpGuides;
          }

          return [];
        },
        canDownloadGuides() {
          return this.isInternalUser === true;
        },
        brandLogoSrc() {
          return this.isInternalUser === false
            ? "/app/images/HelpGuides/cbre-logo.svg"
            : "/app/images/HelpGuides/facilio-logo.svg";
        },
        brandLogoAlt() {
          return this.isInternalUser === false ? "CBRE" : "Facilio";
        },
        filteredCategories() {
          const query = this.searchQuery.trim().toLowerCase();
          const sourceCategories = this.categoryList;
          if (!query) {
            return sourceCategories;
          }

          return sourceCategories.filter((category) => {
            return (
              category.title.toLowerCase().includes(query) ||
              category.description.toLowerCase().includes(query)
            );
          });
        },
        filters() {
          const resources = this.activeResources;
          const articleCount = resources.filter((resource) => resource.type === "Article").length;
          const videoCount = resources.filter((resource) => resource.type === "Video").length;
          const pdfCount = resources.filter((resource) => resource.type === "PDF").length;

          return [
            { label: "All", count: resources.length },
            { label: "Articles", count: articleCount },
            { label: "Videos", count: videoCount },
            { label: "PDF", count: pdfCount },
          ];
        },
        filteredResources() {
          if (!this.activeCategory) {
            return [];
          }

          const resources = this.activeResources;
          const query = this.resourceSearchQuery.trim().toLowerCase();

          return resources.filter((resource) => {
            if (this.activeFilter === "Articles" && resource.type !== "Article") {
              return false;
            }

            if (this.activeFilter === "Videos" && resource.type !== "Video") {
              return false;
            }

            if (this.activeFilter === "PDF" && resource.type !== "PDF") {
              return false;
            }

            if (!query) {
              return true;
            }

            return resource.title.toLowerCase().includes(query);
          });
        },
        articleBlocks() {
          if (!this.previewResource) {
            return [];
          }

          if (this.previewResource.type !== "Article") {
            return [];
          }

          if (!this.previewResource.content) {
            return [];
          }

          return parseArticleContent(this.previewResource.content);
        },
      },
      mounted() {
        this.applySearchQueryPrefill();
        this.onHashChange();
        window.addEventListener("hashchange", this.onHashChange);
        document.addEventListener("keydown", this.handleEscapeKey);

        if (!window.location.hash) {
          window.location.hash = "#/";
        }

        this.refreshIcons();

        try {
          window.facilioApp = FacilioAppSDK.init();
          window.facilioApp.on("app.loaded", async (data) => {
            await this.applySearchQueryPrefill(data);
            if (typeof window.facilioApp.getCurrentUser === "function") {
              this.currentUser = window.facilioApp.getCurrentUser();
            }
            await this.fetchIsInternalUser();
            await this.getHelpGuideCategoryDetails();
            if (this.selectedSlug) {
              const selectedCategory = this.activeCategory;
              if (selectedCategory) {
                await this.getHelpGuideDetails(selectedCategory.id);
              }
            }
            this.fetchData();
          });
        } catch (error) {
          console.warn("Facilio SDK not available. Running in standalone mode.", error);
        }
      },
      updated() {
        this.refreshIcons();
      },
      beforeDestroy() {
        window.removeEventListener("hashchange", this.onHashChange);
        document.removeEventListener("keydown", this.handleEscapeKey);
        if (this.mobileToastTimer) {
          clearTimeout(this.mobileToastTimer);
          this.mobileToastTimer = null;
        }
        if (this.mobileDownloadUnlockTimer) {
          clearTimeout(this.mobileDownloadUnlockTimer);
          this.mobileDownloadUnlockTimer = null;
        }
      },
      methods: {
        async applySearchQueryPrefill(appLoadedData) {
          if (this.hasAppliedSearchQueryPrefill && !isEmpty(this.searchQuery)) {
            return;
          }

          const extraSources = [];
          if (appLoadedData) {
            extraSources.push(appLoadedData);
            if (appLoadedData.context) {
              extraSources.push(appLoadedData.context);
            }
          }

          try {
            if (
              window.facilioApp &&
              window.facilioApp.interface &&
              typeof window.facilioApp.interface.getCurrentPage === "function"
            ) {
              const currentPageResult = window.facilioApp.interface.getCurrentPage();
              const currentPageData =
                currentPageResult && typeof currentPageResult.then === "function"
                  ? await currentPageResult
                  : currentPageResult;
              if (!isEmpty(currentPageData)) {
                extraSources.push(currentPageData);
              }
            }
          } catch (_error) {
            // Ignore current page extraction failures.
          }

          const queryText = getInitialDesktopSearchQuery(extraSources);
          if (!queryText) {
            return;
          }

          this.searchQuery = queryText;
          this.hasAppliedSearchQueryPrefill = true;
        },
        getCurrentRoleId() {
          const roleId = Number(
            this.currentUser &&
              this.currentUser.role &&
              this.currentUser.role.id
          );

          return Number.isFinite(roleId) ? roleId : null;
        },
        async fetchIsInternalUser() {
          try {
            const roleId = this.getCurrentRoleId();
            if (!Number.isFinite(roleId)) {
              console.warn("Unable to fetch InternalUser details: invalid role id.");
              this.isInternalUser = false;
              return;
            }

            let response = await window.facilioApp.request.invokeFacilioAPI(
              "/v2/workflow/runWorkflow",
              {
                method: "POST",
                data: {
                  nameSpace: "helpGuide",
                  functionName: "isInternalUser",
                  paramList: [roleId],
                },
              }
            );

            this.isInternalUser =
              response &&
              response.result &&
              response.result.workflow
                ? Boolean(response.result.workflow.returnValue)
                : false;

            console.log(this.isInternalUser);
          } catch (err) {
            console.error("Error fetching InternalUser details:", err);
            this.isInternalUser = false;
          }
        },
        onBrandLogoError(event) {
          if (!event || !event.target) {
            return;
          }

          event.target.src = "/app/images/HelpGuides/facilio-logo.svg";
        },
        normalizeHelpGuideCategory(record, index) {
          const source =
            record && typeof record === "object" && !Array.isArray(record)
              ? record
              : parseMapLikeString(record);

          const idValue =
            source.id ||
            source.categoryId ||
            source.category_id ||
            source.helpCategoryId ||
            source.help_category_id ||
            ("dynamic-" + (index + 1));

          const title =
            source.name ||
            source.title ||
            source.categoryName ||
            source.category_name ||
            ("Category " + (index + 1));

          const description =
            source.description_custom_helpguidecategories ||
            source.description ||
            source.categoryDescription ||
            source.category_description ||
            "";

          const id = String(idValue);
          const fallbackSlug = "category-" + id;
          const slug = slugify(title, fallbackSlug) + "-" + id;

          return {
            id: id,
            slug: slug,
            title: String(title),
            description: String(description || "No description available."),
            articleCount: 0,
            videoCount: 0,
            pdfCount: 0,
            resources: [],
          };
        },
        normalizeHelpGuideCategories(rawList) {
          if (!Array.isArray(rawList)) {
            return [];
          }

          return rawList
            .map((item, index) => this.normalizeHelpGuideCategory(item, index))
            .filter((item) => !isEmpty(item.title));
        },
        normalizeHelpGuide(record, index) {
          const source =
            record && typeof record === "object" && !Array.isArray(record)
              ? record
              : parseMapLikeString(record);

          const idValue =
            source.id ||
            source.guideId ||
            source.guide_id ||
            source.helpGuideId ||
            source.help_guide_id ||
            source.file_upload_custom_helpguidesId ||
            ("guide-" + (index + 1));

          const title =
            source.name ||
            source.title ||
            source.file_upload_custom_helpguidesFileName ||
            ("Guide " + (index + 1));

          const description =
            source.description_custom_helpguides ||
            source.description ||
            source.guideDescription ||
            source.guide_description ||
            "";

          const previewUrl = resolveFacilioUrl(
            source.file_upload_custom_helpguidesUrl ||
              source.url ||
              source.previewUrl ||
              source.preview_url ||
              ""
          );

          const downloadUrl = resolveFacilioUrl(
            source.file_upload_custom_helpguidesDownloadUrl ||
              source.downloadUrl ||
              source.download_url ||
              ""
          );

          const guideType = String(
            source.guide_type_custom_helpguides ||
              source.guideType ||
              source.guide_type ||
              ""
          ).toLowerCase();

          const contentType = String(
            source.file_upload_custom_helpguidesContentType ||
              source.contentType ||
              source.content_type ||
              ""
          ).toLowerCase();

          const rawFileName = String(
            source.file_upload_custom_helpguidesFileName || source.fileName || ""
          ).trim();
          const fileName = rawFileName.toLowerCase();
          const fileIdValue =
            source.file_upload_custom_helpguidesId ||
            source.fileId ||
            source.file_id ||
            "";

          let type = "Article";
          if (guideType.includes("video") || contentType.indexOf("video/") === 0) {
            type = "Video";
          } else if (
            guideType.includes("document") ||
            guideType.includes("pdf") ||
            contentType.includes("pdf") ||
            fileName.endsWith(".pdf")
          ) {
            type = "PDF";
          } else if (guideType.includes("article") || guideType.includes("text")) {
            type = "Article";
          }

          const guideUrl =
            type === "Video"
              ? (downloadUrl || previewUrl || "")
              : (previewUrl || downloadUrl || "");

          const normalizedGuide = {
            id: String(idValue),
            title: String(title),
            type: type,
            url: guideUrl,
            downloadUrl: downloadUrl || previewUrl || "",
            fileId: String(fileIdValue || ""),
            fileName: buildDownloadFileName(
              rawFileName,
              title,
              contentType,
              type
            ),
            contentType: contentType,
            description: String(description || ""),
          };

          if (type === "Article") {
            normalizedGuide.content = String(description || title || "");
          }

          return normalizedGuide;
        },
        normalizeHelpGuides(rawList) {
          if (!Array.isArray(rawList)) {
            return [];
          }

          return rawList
            .map((item, index) => this.normalizeHelpGuide(item, index))
            .filter((item) => !isEmpty(item.title));
        },
        async getHelpGuideCategoryDetails() {
          try {
            const roleId = this.getCurrentRoleId();
            if (!Number.isFinite(roleId)) {
              console.warn("Unable to fetch Help Category details: invalid role id.");
              this.helpCategories = [];
              return;
            }

            let response = await window.facilioApp.request.invokeFacilioAPI(
              "/v2/workflow/runWorkflow",
              {
                method: "POST",
                data: {
                  nameSpace: "helpGuide",
                  functionName: "getHelpGuideCategories",
                  paramList: [roleId],
                },
              }
            );

            const rawCategories =
              response &&
              response.result &&
              response.result.workflow &&
              response.result.workflow.returnValue;

            this.helpCategories = this.normalizeHelpGuideCategories(rawCategories);
            console.log(this.helpCategories);
          } catch (err) {
            console.error("Error fetching Help Category details:", err);
            this.helpCategories = [];
          }
        },
        async getHelpGuideDetails(categoryId) {
          try {
            const roleId = this.getCurrentRoleId();
            if (isEmpty(categoryId) || !Number.isFinite(roleId)) {
              this.HelpGuides = [];
              return;
            }

            const categoryAsNumber = Number(categoryId);
            const categoryParam = Number.isFinite(categoryAsNumber)
              ? categoryAsNumber
              : categoryId;

            let response = await window.facilioApp.request.invokeFacilioAPI(
              "/v2/workflow/runWorkflow",
              {
                method: "POST",
                data: {
                  nameSpace: "helpGuide",
                  functionName: "getHelpGuides",
                  paramList: [categoryParam, roleId],
                },
              }
            );

            const rawGuides =
              response &&
              response.result &&
              response.result.workflow &&
              response.result.workflow.returnValue;

            this.HelpGuides = this.normalizeHelpGuides(rawGuides);
            this.$set(this.guidesByCategory, String(categoryId), this.HelpGuides);
            console.log(this.HelpGuides);
          } catch (err) {
            console.error("Error fetching Help Category details:", err);
            this.HelpGuides = [];
            this.$set(this.guidesByCategory, String(categoryId), []);
          }
        },
        fetchData() {
          console.log(isEmpty(this.currentUser));
        },
        onHashChange() {
          const nextSlug = getSlugFromHash(window.location.hash);
          const changed = this.selectedSlug !== nextSlug;

          this.selectedSlug = nextSlug;
          if (changed) {
            this.activeFilter = DEFAULT_FILTER;
            this.resourceSearchQuery = "";
            this.previewResource = null;
          }

          if (this.selectedSlug) {
            const selectedCategory = this.categoryList.find(
              (category) => category.slug === this.selectedSlug
            );

            if (!selectedCategory) {
              this.HelpGuides = [];
              return;
            }

            const categoryId = String(selectedCategory.id);
            const cachedGuides = this.guidesByCategory[categoryId];
            this.HelpGuides = Array.isArray(cachedGuides) ? cachedGuides : [];

            if (!Array.isArray(cachedGuides) || cachedGuides.length === 0) {
              this.getHelpGuideDetails(selectedCategory.id);
            }
            return;
          }

          this.HelpGuides = [];
        },
        openCategory(categoryOrSlug) {
          let category = null;
          if (
            categoryOrSlug &&
            typeof categoryOrSlug === "object" &&
            !Array.isArray(categoryOrSlug)
          ) {
            category = categoryOrSlug;
          } else {
            category = this.categoryList.find(
              (item) => item.slug === String(categoryOrSlug)
            );
          }

          const slug = category
            ? category.slug
            : String(categoryOrSlug || "").trim();

          if (!slug) {
            return;
          }

          window.location.hash = "#/category/" + encodeURIComponent(slug);

          if (category && !isEmpty(category.id)) {
            this.getHelpGuideDetails(category.id);
          }
        },
        goHome() {
          this.HelpGuides = [];
          window.location.hash = "#/";
        },
        showMobileToast(message, durationMs) {
          this.mobileToastMessage = String(message || "").trim();
          this.mobileToastVisible = this.mobileToastMessage.length > 0;

          if (this.mobileToastTimer) {
            clearTimeout(this.mobileToastTimer);
            this.mobileToastTimer = null;
          }

          const timeout = Number(durationMs);
          if (this.mobileToastVisible && Number.isFinite(timeout) && timeout > 0) {
            this.mobileToastTimer = setTimeout(() => {
              this.mobileToastVisible = false;
              this.mobileToastMessage = "";
              this.mobileToastTimer = null;
            }, timeout);
          }
        },
        async openResource(resource) {
          if (this.isMobileViewport()) {
            this.previewResource = null;

            if (this.mobileDownloadInProgress) {
              this.showMobileToast("Please wait, opening selected file...", 2000);
              return;
            }

            this.mobileDownloadInProgress = true;
            this.showMobileToast("Opening file...", 2200);

            try {
              const isOpened = await this.triggerMobileDownload(resource);
              if (!isOpened) {
                this.showMobileToast("Unable to open file. Please try again.", 2400);
              }
            } catch (error) {
              console.error("Error while opening mobile file:", error);
              this.showMobileToast("Unable to open file. Please try again.", 2400);
            } finally {
              if (this.mobileDownloadUnlockTimer) {
                clearTimeout(this.mobileDownloadUnlockTimer);
              }
              this.mobileDownloadUnlockTimer = setTimeout(() => {
                this.mobileDownloadInProgress = false;
                this.mobileDownloadUnlockTimer = null;
              }, 900);
            }
            return;
          }

          this.previewResource = resource;
        },
        closePreview() {
          this.previewResource = null;
        },
        handleEscapeKey(event) {
          if (event.key === "Escape" && this.previewResource) {
            this.closePreview();
          }
        },
        isMobileViewport() {
          return detectMobileBrowser();
        },
        async downloadFile(fileId, fileName) {
          console.log("Button Clicked", fileId, fileName);
          try {
            let response = await window.facilioApp.interface.triggerDownload(
              fileId,
              fileName
            );
            console.log("File download initiated", response);
            return true;
          } catch (error) {
            console.log("Error downloading file", error);
            return false;
          }
        },
        triggerMobileDownload(resource) {
          if (!resource) {
            return false;
          }

          const possibleFileId =
            resource.fileId ||
            resource.file_upload_custom_helpguidesId ||
            extractFileIdFromFacilioUrl(resource.downloadUrl || resource.url || "");
          const numericFileId = Number(possibleFileId);
          const hasValidFileId = Number.isFinite(numericFileId);

          const fileName = buildDownloadFileName(
            resource.fileName || "",
            resource.title || "help guide",
            resource.contentType || "",
            resource.type || ""
          );

          if (!hasValidFileId) {
            console.warn(
              "Skipping mobile triggerDownload: missing valid file id.",
              resource
            );
            return false;
          }

          return this.downloadFile(numericFileId, fileName);
        },
        getResourceIconName(type) {
          if (type === "Article") {
            return "file-text";
          }
          if (type === "Video") {
            return "video";
          }
          return "globe";
        },
        getPreviewHeaderIcon(resource) {
          if (!resource) {
            return "file";
          }

          if (resource.type === "Video") {
            return "play";
          }

          if (resource.type === "Article") {
            return "file-text";
          }

          return "file";
        },
        getPreviewLabel(resource) {
          if (!resource) {
            return "";
          }

          if (resource.type === "Video") {
            return "Video Preview";
          }

          if (resource.type === "Article") {
            return "Article";
          }

          return "PDF Document Preview";
        },
        renderInlineMarkdown(text) {
          return renderInlineMarkdown(text);
        },
        refreshIcons() {
          if (!global.lucide || typeof global.lucide.createIcons !== "function") {
            return;
          }

          this.$nextTick(() => {
            global.lucide.createIcons();
          });
        },
      },
    });
  }

  global.isEmpty = isEmpty;
  global.createOperationsHelpDeskApp = createOperationsHelpDeskApp;
})(window);
