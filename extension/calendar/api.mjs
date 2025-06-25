const { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
const { cal } = ChromeUtils.import("resource:///modules/calendar/calUtils.jsm");

class API extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      calendarMcp: {
        async listCalendars() {
          try {
            const calendars = cal.manager.getCalendars({});
            return Array.from(calendars, c => ({
              id: c.id,
              name: c.name,
              uri: c.uri ? c.uri.spec : null,
            }));
          } catch (e) {
            console.error("calendarMcp.listCalendars", e);
            throw e;
          }
        }
      }
    };
  }
}

export default API;
