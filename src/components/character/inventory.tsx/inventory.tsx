import { useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../items/draggableItem";
import { Products } from "../../items/itemdropzone/itemDropZone";
import { AlteredItem } from "../../items/itemEditor";
import { Scroll } from "../../scroll/scroll";
import { Character, HistoryFilter } from "../Character.types";
import { HistoryItem } from "../history/history";

export const Inventory = ({
  char: [char, setChar] = [{}, () => ({})],
  catalog,
  historyFilter,
}: {
  char: [Partial<Character>, (value: Partial<Character>) => void];
  catalog: { [key: string]: AlteredItem };
  historyFilter: [HistoryFilter, (value: HistoryFilter) => void];
}) => {
  const [currentHistory, setCurrentHistory] = useState<null | string>(null);
  const dropHandler = (item: AlteredItem) => {
    const newId = Math.random().toString(36).slice(2, 9);
    setChar({
      ...char,
      history: {
        ...char.history,
        [newId]: {
          parentID: "topLevel",
          ID: newId,
          product: {
            [item.id]: {
              itemID: item.id,
              number: 1,
            },
          },
          time: Object.values(char.history ?? {}).length,
          description: catalog[item.id]?.description,
          name: catalog[item.id]?.obtainString,
          importance: 0,
        },
      },
    });
    setCurrentHistory(newId);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, dropAdd] = useDrop(
    () => ({
      accept: ItemTypes.LOOT,
      drop: dropHandler,
    }),
    [char, catalog]
  );
  const GetAllItems = (
    h: Products,
    inCount = {},
    loopDetect: string[] = [],
    mult = 1
  ) => {
    let itemCounts: { [key: string]: number } = inCount;
    for (const e of Object.values(h)) {
      if (loopDetect.includes(e.itemID)) {
        return itemCounts;
      }
      if (e.itemID) {
        itemCounts[e.itemID] =
          (itemCounts[e.itemID] ?? 0) + (e.number ?? 0) * mult;
      }
      const subProducts = catalog[e.itemID]?.passiveContainsID;

      if (subProducts) {
        itemCounts = GetAllItems(
          subProducts,
          itemCounts,
          [...loopDetect, e.itemID],
          mult * (e.number ?? 1)
        );
      }
    }

    return itemCounts;
  };

  return (
    <div>
      {char.history && currentHistory ? (
        <HistoryItem
          catalog={catalog}
          dropDeps={[char, catalog]}
          SubEventsCount={0}
          filter={historyFilter}
          data={[
            char.history?.[currentHistory],
            (value) => {
              setChar({
                ...char,
                history: {
                  ...char.history,
                  [currentHistory]: value,
                },
              });
            },
          ]}
        ></HistoryItem>
      ) : (
        ""
      )}
      <div ref={dropAdd}>
        <Scroll
          width="100%"
          height="720px"
          maxItems={7}
          batch={7}
          dir="vertical"
          updateOn={[char, catalog]}
          children={Object.entries(
            Object.values(char.history ?? []).reduce(
              (a, b) => GetAllItems(b.product ?? {}, a),

              {} as { [key: string]: number }
            )
          ).map(([id, number]) => (
            <div
              className="paperus button"
              style={{
                position: "relative",
                height: "32px",
                backgroundImage: `url(${catalog[id]?.image})`,
              }}
              onClick={() => {
                const newId = Math.random().toString(36).slice(2, 9);
                setChar({
                  ...char,
                  history: {
                    ...char.history,
                    [newId]: {
                      parentID: "topLevel",
                      ID: newId,
                      product: catalog[id]?.activeTransformID ?? {},
                      time: Object.values(char.history ?? {}).length,
                      description: catalog[id]?.activateString,
                      name: catalog[id]?.name,
                      importance: 0,
                    },
                  },
                });
                setCurrentHistory(newId);
              }}
            >
              <div
                className="paperus"
                style={{
                  position: "absolute",
                  top: "-32px",
                  left: "-25px",
                  scale: "0.6",
                  zIndex: 15,
                }}
              >
                {number}
              </div>
            </div>
          ))}
        ></Scroll>
      </div>
    </div>
  );
};
