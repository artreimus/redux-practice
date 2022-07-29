// import { apiCallBegan } from "../api";
// import { config } from "webpack";
import {
  addBug,
  bugAdded,
  resolveBug,
  loadBugs,
  getUnresolvedBugs,
} from "../bugs";
import { apiCallBegan } from "../api";
import configureStore from "../configureStore";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Solitary Test

describe("bugsSlice", () => {
  describe("action creators", () => {
    it("addBug", () => {
      const bug = { description: "a" };
      const result = addBug({ description: "a" });
      const expected = {
        type: apiCallBegan.type,
        payload: {
          url: "/bugs",
          method: "post",
          data: bug,
          onSuccess: bugAdded.type,
        },
      };
      expect(result).toEqual(expected);
    });
  });
});

// Social Test
// Testing the behavior

describe("bugsSlice", () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const bugsSlice = () => store.getState().entities.bugs;

  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  // Without mocking
  // test("should handle the addBug action", async () => {
  //   const bug = { description: "a" };
  //   await store.dispatch(addBug(bug));
  //   expect(store.getState().entities.bugs.list).toHaveLength(1);
  // });

  // With mocking
  test("should handle the addBug action. mock test", async () => {
    const bug = { description: "a" };
    const savedBug = { ...bug, id: 1 };
    const fakeAxios = new MockAdapter(axios);
    fakeAxios.onPost("/bugs").reply(200, savedBug);
    const store = configureStore();
    await store.dispatch(addBug(bug));
    expect(store.getState().entities.bugs.list).toContainEqual(savedBug);
  });

  // Cleaner testing code that follows the AAA pattern (Arrange, Act, Assert)
  test("should add the bug to the store if it's saved to the server", async () => {
    const bug = { description: "a" };
    const savedBug = { ...bug, id: 1 };
    fakeAxios.onPost("/bugs").reply(200, savedBug);
    await store.dispatch(addBug(bug));
    expect(bugsSlice().list).toContainEqual(savedBug);
  });

  test("should not add the bug to the store if it's saved to the server", async () => {
    const bug = { description: "a" };
    const savedBug = { ...bug, id: 1 };
    fakeAxios.onPost("/bugs").reply(500, savedBug);
    await store.dispatch(addBug(bug));
    expect(bugsSlice().list).toHaveLength(0);
  });

  test("should mark the bug as resolved, if it's saved to the server", async () => {
    fakeAxios.onPatch("/bugs/1").reply(200, { id: 1, resolved: true });
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });
    await store.dispatch(addBug({ description: "a" }));
    await store.dispatch(resolveBug(1));
    expect(bugsSlice().list[0].resolved).toBe(true);
  });

  test("should mark the bug as resolved, if it's not saved to the server", async () => {
    fakeAxios.onPatch("/bugs/1").reply(500, { id: 1, resolved: true });
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });
    await store.dispatch(addBug({ description: "a" }));
    await store.dispatch(resolveBug(1));
    expect(bugsSlice().list[0].resolved).not.toBe(true);
  });

  describe("loading bugs", () => {
    describe("if the bugs exist in the cache", () => {
      test("they should not be fetched from the server again", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);
        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());
        expect(fakeAxios.history.get.length).toBe(1);
      });
    });

    describe("if the bugs does not exist in the cache", () => {
      test("they should be fetched from the server and put in the store", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }, { id: 1 }]);
        await store.dispatch(loadBugs());
        expect(bugsSlice().list).toHaveLength(2);
      });

      describe("loading indicator", () => {
        test("should be true while fetching the bugs", () => {
          // fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);
          fakeAxios.onGet("/bugs").reply(() => {
            expect(bugsSlice().loading).toBe(true);
            return [200, [{ id: 1 }]];
          });
          store.dispatch(loadBugs());
        });

        test("should be false after fetching the bugs", async () => {
          fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);
          await store.dispatch(loadBugs());
          expect(bugsSlice().loading).toBe(false);
        });

        test("should be false if server returns an error", async () => {
          fakeAxios.onGet("/bugs").reply(500, [{ id: 1 }]);
          await store.dispatch(loadBugs());
          expect(bugsSlice().loading).toBe(false);
        });
      });
    });
  });

  describe("selectors", () => {
    test("getUnResolvedBugs", () => {
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, resolved: false },
        { id: 2, resolved: false },
        { id: 3, resolved: true },
      ];
      const result = getUnresolvedBugs(state);
      expect(result).toHaveLength(2);
    });
  });
});

// With mocking
