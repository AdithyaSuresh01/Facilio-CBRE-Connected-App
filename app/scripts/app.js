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
        categories: global.OPS_HELP_DESK_CATEGORIES || [],
        helpCategories: [],
        HelpGuides: [],
        guidesByCategory: {},
        hasFetchedHelpCategories: false,
        searchQuery: "",
        resourceSearchQuery: "",
        activeFilter: DEFAULT_FILTER,
        previewResource: null,
        selectedSlug: null,
      },
      computed: {
        categoryList() {
          if (this.hasFetchedHelpCategories) {
            return this.helpCategories;
          }

          return this.categories;
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

          return Array.isArray(this.activeCategory.resources)
            ? this.activeCategory.resources
            : [];
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
        this.onHashChange();
        window.addEventListener("hashchange", this.onHashChange);
        document.addEventListener("keydown", this.handleEscapeKey);

        if (!window.location.hash) {
          window.location.hash = "#/";
        }

        this.refreshIcons();

        try {
          global.facilioApp = FacilioAppSDK.init();
          global.facilioApp.on("app.loaded", async () => {
            if (typeof global.facilioApp.getCurrentUser === "function") {
              this.currentUser = global.facilioApp.getCurrentUser();
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
      },
      methods: {
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

            let response = await global.facilioApp.request.invokeFacilioAPI(
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

          const staticCategoryMatch = this.categories.find((category) => {
            return (
              category.title.toLowerCase() === String(title).toLowerCase() ||
              category.slug === slugify(title, fallbackSlug)
            );
          });

          if (staticCategoryMatch) {
            return {
              id: id,
              slug: staticCategoryMatch.slug,
              title: String(title),
              description: String(description || staticCategoryMatch.description || ""),
              articleCount: staticCategoryMatch.articleCount || 0,
              videoCount: staticCategoryMatch.videoCount || 0,
              pdfCount: staticCategoryMatch.pdfCount || 0,
              resources: staticCategoryMatch.resources || [],
            };
          }

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
              this.hasFetchedHelpCategories = true;
              return;
            }

            let response = await global.facilioApp.request.invokeFacilioAPI(
              "/v2/workflow/runWorkflow",
              {
                method: "POST",
                data: {
                  nameSpace: "helpGuide",
                  functionName: "getHelpGuideCategories",
                  paramList: roleId,
                },
              }
            );

            const rawCategories =
              response &&
              response.result &&
              response.result.workflow &&
              response.result.workflow.returnValue;

            this.helpCategories = this.normalizeHelpGuideCategories(rawCategories);
            this.hasFetchedHelpCategories = true;
            console.log(this.helpCategories);
          } catch (err) {
            console.error("Error fetching Help Category details:", err);
            this.helpCategories = [];
            this.hasFetchedHelpCategories = true;
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

            let response = await global.facilioApp.request.invokeFacilioAPI(
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
        openResource(resource) {
          if (this.isMobileViewport()) {
            this.previewResource = null;
            this.triggerMobileDownload(resource);
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
          if (global && typeof global.matchMedia === "function") {
            return global.matchMedia("(max-width: 640px)").matches;
          }

          const width =
            (global && global.innerWidth) ||
            (global &&
              global.document &&
              global.document.documentElement &&
              global.document.documentElement.clientWidth) ||
            1024;

          return width <= 640;
        },
        triggerMobileDownload(resource) {
          if (!resource) {
            return false;
          }

          const possibleFileId =
            resource.fileId ||
            resource.file_upload_custom_helpguidesId ||
            resource.id;
          const fileId = Number(possibleFileId);

          if (!Number.isFinite(fileId)) {
            return false;
          }

          const fileName = buildDownloadFileName(
            resource.fileName || "",
            resource.title || "help guide",
            resource.contentType || "",
            resource.type || ""
          );

          try {
            if (
              global.facilioApp &&
              global.facilioApp.interface &&
              typeof global.facilioApp.interface.triggerDownload === "function"
            ) {
              global.facilioApp.interface.triggerDownload(fileId, fileName);
              return true;
            }
          } catch (error) {
            console.error("Error triggering mobile guide download:", error);
          }

          return false;
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
