import { useEffect, useState } from "react";
import { InputField } from "../inputs/Input";
import { AlteredItem } from "../items/itemEditor";
import { Scroll } from "../scroll/scroll";
import { AppearenceSheet } from "./appearence.tsx/Appearence";
import { Character, History, HistoryFilter } from "./Character.types";
import "./character.scss";
import { HistoryItem } from "./history/history";
import { Inventory } from "./inventory.tsx/inventory";

enum Pages {
  Details,
  History,
  Inventory,
}
export function CharacterSheet({
  data: [char = {}, setChar],
  catalog,
}: {
  data: [Partial<Character>, (value: Partial<Character>) => void];
  catalog: { [key: string]: AlteredItem };
}) {
  const [page, setPage] = useState(Pages.Details);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>({
    searchText: "",
    parentID: "topLevel",
    importance: undefined,
  });
  const HistoryFilter = (h: History) => {
    return (
      ((h.name?.includes(historyFilter.searchText) ?? true) ||
        (h.ID?.includes(historyFilter.searchText) ?? true)) &&
      (historyFilter.importance === undefined ||
        h.importance === historyFilter.importance) &&
      h.parentID === historyFilter.parentID
    );
  };

  useEffect(() => {
    setPage(Pages.History);
  }, [historyFilter]);

  return (
    <div className="character-overlay">
      <div style={{ display: "flex" } as any}>
        <div className="paperus">
          <InputField
            type="text"
            data={[
              char.name || "Stranger",
              (value) => setChar({ ...char, name: value }),
            ]}
          />
        </div>
        <div className="paperus button" onClick={(_) => setPage(Pages.Details)}>
          Details
        </div>
        <div className="paperus button" onClick={(_) => setPage(Pages.History)}>
          History
        </div>
        <div
          className="paperus button"
          onClick={(_) => setPage(Pages.Inventory)}
        >
          Inventory
        </div>
      </div>
      {page === Pages.Details ? (
        <div>
          <div className="character-sheet paperus">
            <AppearenceSheet
              data={[
                char.appearance || {},
                (a) => setChar({ ...char, appearance: a }),
              ]}
            />
          </div>
          <div className="paperus" style={{ height: "300px" }}>
            Description:
            <br />
            <InputField
              type="textarea"
              data={[
                char.description ?? "No description yet...",
                (value) => setChar({ ...char, description: value }),
              ]}
            />
          </div>
        </div>
      ) : page === Pages.History ? (
        <div>
          <div style={{ display: "flex" } as any}>
            <div
              className="paperus button"
              onClick={(_) =>
                setHistoryFilter({
                  ...historyFilter,
                  parentID:
                    historyFilter.parentID === "topLevel"
                      ? "topLevel"
                      : char.history?.[historyFilter.parentID]?.parentID ??
                        "topLevel",
                })
              }
            >
              {historyFilter.parentID === "topLevel"
                ? "History"
                : char.history?.[historyFilter.parentID]?.name ?? "History"}
            </div>
            <div
              className="paperus"
              style={{
                display: "flex",
              }}
            >
              Search:
              <InputField
                type="text"
                data={[
                  historyFilter.searchText,
                  (value) =>
                    setHistoryFilter({
                      ...historyFilter,
                      searchText: value ?? "",
                    }),
                ]}
              />
            </div>
          </div>
          <Scroll
            width="100%"
            height="720px"
            maxItems={4}
            dir="vertical"
            updateOn={[historyFilter]}
            children={[
              ...(Object.values(char.history ?? {})
                .filter(HistoryFilter)
                .map((h) => (
                  <HistoryItem
                    catalog={catalog}
                    dropDeps={[char]}
                    filter={[historyFilter, setHistoryFilter]}
                    SubEventsCount={
                      Object.values(char.history ?? {}).filter(
                        (h2) => h2.parentID === h.ID
                      ).length
                    }
                    data={[
                      h,
                      (value) =>
                        setChar({
                          ...char,
                          history: {
                            ...(char.history ?? {}),
                            [h.ID]: value,
                          },
                        }),
                    ]}
                  />
                )) ?? []),
              <div
                className="paperus button"
                onClick={(_) => {
                  const newID = Math.random().toString(36).substring(7);
                  setChar({
                    ...char,

                    history: {
                      ...(char.history ?? {}),
                      [newID]: {
                        parentID: historyFilter.parentID,
                        ID: newID,
                      },
                    },
                  });
                }}
              >
                Add History
              </div>,
            ]}
          ></Scroll>
        </div>
      ) : (
        <Inventory
          historyFilter={[historyFilter, setHistoryFilter]}
          catalog={catalog}
          char={[char, setChar]}
        ></Inventory>
      )}
    </div>
  );
}
