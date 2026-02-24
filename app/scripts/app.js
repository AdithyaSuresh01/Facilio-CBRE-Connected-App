(function (global) {
  "use strict";

  const DEFAULT_FILTER = "All";

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
        categories: global.OPS_HELP_DESK_CATEGORIES || [],
        helpCategories: [],
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
          const resources = this.activeCategory ? this.activeCategory.resources : [];
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

          const resources = this.activeCategory.resources;
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
            await this.getHelpGuideCategoryDetails();
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
        async getHelpGuideCategoryDetails() {
          try {
            const roleId = Number(
              this.currentUser &&
                this.currentUser.role &&
                this.currentUser.role.id
            );

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
        },
        openCategory(slug) {
          window.location.hash = "#/category/" + encodeURIComponent(slug);
        },
        goHome() {
          window.location.hash = "#/";
        },
        openResource(resource) {
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
