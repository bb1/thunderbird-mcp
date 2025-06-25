const { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
const { Gloda } = ChromeUtils.import("resource:///modules/gloda/GlodaPublic.jsm");

class API extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      searchIndex: {
        async query(details) {
          const { text } = details;
          try {
            const query = Gloda.newQuery(Gloda.NOUN_MESSAGE).text(text);
            const collection = query.getCollection();
            await collection.wait();
            return collection.items.map(m => ({
              id: m.headerMessageID,
              subject: m.subject,
              folder: m.folder.URI,
            }));
          } catch (e) {
            console.error("searchIndex.query error", e);
            throw e;
          }
        }
      }
    };
  }
}

export default API;
