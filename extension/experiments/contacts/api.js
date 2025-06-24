const { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
const { MailServices } = ChromeUtils.import("resource:///modules/MailServices.jsm");

class API extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      contactsMcp: {
        async search(query) {
          try {
            const results = [];
            for (const book of MailServices.ab.directories) {
              for (const card of book.childCards) {
                if (card.isMailList) {
                  continue;
                }
                const email = (card.primaryEmail || "").toLowerCase();
                if (email.includes(query.toLowerCase())) {
                  results.push({
                    id: card.UID,
                    displayName: card.displayName,
                    email: card.primaryEmail,
                  });
                }
              }
            }
            return results;
          } catch (e) {
            console.error("contactsMcp.search", e);
            throw e;
          }
        }
      }
    };
  }
}

this.API = API;
