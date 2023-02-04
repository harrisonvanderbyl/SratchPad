// import React from "react";
// import logo from "./logo.svg";
import { CSSProperties, useEffect, useState } from "react";

import "./App.scss";
import { Editor } from "./components/textEditor/Editor";
import { Generate } from "./scripts/generate";
import backgroundImg from "./theme/images/default.webp";
import paperImg from "./theme/images/paperus.webp";
import borderImg from "./theme/images/burnt.png";

import { CharacterSheet } from "./components/character/Character";
import { Theme } from "./theme/theme";
import { Scroll } from "./components/scroll/scroll";
import { AlteredItem, ItemEditor } from "./components/items/itemEditor";
import { defaultItem } from "./components/items/itemEditor";

import { DraggableItem, ItemTypes } from "./components/items/draggableItem";
import { Character } from "./components/character/Character.types";

function App() {
  const [textData, setTextData] = useState<string[]>(
    JSON.parse(localStorage.getItem("textdata") ?? "['']")
  );
  const [isLoadingBackground, setIsLoadingBackground] = useState(false);
  const [theme, setTheme] = useState<Theme>({
    backGroundImage: backgroundImg,
    paperImage: paperImg,
    borderImage: borderImg,
  });
  const [itemList, setItemList] = useState<{ [key: string]: AlteredItem }>(
    JSON.parse(localStorage.getItem("items") ?? "{}")
  );
  const [currenItem, setCurrentItem] = useState<null | string>(null);
  const [characters, setCharacters] = useState<Partial<Character>[]>(
    JSON.parse(localStorage.getItem("characters") ?? "[{}]")
  );
  useEffect(() => {
    localStorage.setItem("characters", JSON.stringify(characters));
    localStorage.setItem("items", JSON.stringify(itemList));
    localStorage.setItem("textdata", JSON.stringify(textData));
  }, [characters, itemList, textData]);
  const [currentCharacter, setCurrentCharacter] = useState(0);

  const [toolbar, setToolbar] = useState({
    characters: true,
    items: false,
  });

  // do onload once when first loaded the page (not on every render)
  const updateBackground = () => {
    if (isLoadingBackground) return;
    setIsLoadingBackground(true);
    Generate(
      "A photo of a clutterered antique writing desk covered in writing and author stuff, viewed from above"
    ).then((res) => {
      if (res.length === 0) return;
      setTheme({ ...theme, backGroundImage: res[0] || "" });
      setIsLoadingBackground(false);
    });
  };

  return (
    <div
      style={
        {
          "--border-image": "url(" + theme.borderImage + ")",
          "--paper-image": "url(" + theme.paperImage + ")",
          padding: "10px",
        } as any
      }
    >
      <div
        style={
          {
            display: "flex",
            "flex-wrap": "wrap",
          } as CSSProperties
        }
      >
        <div
          className="button paperus"
          onClick={() => {
            setToolbar({
              ...toolbar,
              characters: !toolbar.characters,
            });
          }}
        >
          Characters
        </div>
        <div
          className="button paperus"
          onClick={() => {
            setToolbar({
              ...toolbar,
              items: !toolbar.items,
            });
          }}
        >
          Items Loot
        </div>
        <div onClick={updateBackground} className="paperus button">
          {isLoadingBackground ? "Loading" : "Refresh Background"}
        </div>
        <div
          className="paperus button"
          onClick={() => {
            // download local storage
            const data = JSON.stringify({
              characters,
              items: itemList,
              textdata: textData,
            });
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = "airpg.json";
            link.href = url;
            link.click();
          }}
        >
          Save
        </div>
        <div
          className="paperus button"
          onClick={() => {
            // upload local storage
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "application/json";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (e) => {
                const data = JSON.parse(e.target?.result as string);
                setCharacters(data.characters);
                setItemList(data.items);
                setTextData(data.textdata);
              };
              reader.readAsText(file);
            };
            input.click();
          }}
        >
          Load
        </div>
        <div
          className="paperus button"
          onClick={() => {
            setCharacters([{}]);
            setItemList({});
            setTextData([""]);
          }}
        >
          Reset
        </div>
      </div>
      <div>
        <div
          style={
            {
              display: "flex",
              "flex-wrap": "wrap",
            } as CSSProperties
          }
          onScroll={(e) => {
            console.log(e);
          }}
        >
          <div
            className={
              "character-menu " +
              (toolbar.characters ? "show-menu" : "hidden-menu")
            }
          >
            <div className="paperus">Characters</div>
            <Scroll
              dir="horizontal"
              maxItems={7}
              children={
                // map characters to buttons
                [
                  ...characters.map((c, i) => (
                    <div
                      key={i}
                      onClick={() => setCurrentCharacter(i)}
                      className={"paperus button charButton"}
                      style={
                        {
                          ...(c.appearance?.image
                            ? {
                                "background-image":
                                  "url(" + c.appearance?.image + ")",
                              }
                            : {}),
                        } as any
                      }
                    >
                      {}
                    </div>
                  )),
                  <div
                    onClick={() => setCharacters([...characters, {}])}
                    className="paperus button"
                    style={
                      {
                        "min-width": "32px",
                        height: "32px",
                        fontSize: "32px",
                        "text-align": "center",
                        // align v
                      } as any
                    }
                  >
                    +
                  </div>,
                ]
              }
            ></Scroll>

            <CharacterSheet
              catalog={itemList}
              data={[
                characters[currentCharacter],
                (c) =>
                  setCharacters([
                    ...characters.slice(0, currentCharacter),
                    c,
                    ...characters.slice(currentCharacter + 1),
                  ]),
              ]}
            ></CharacterSheet>
          </div>
          <div
            className={
              "item-menu " + (toolbar.items ? "show-menu" : "hidden-menu")
            }
          >
            <div className="paperus">Loot</div>
            {currenItem ? (
              <ItemEditor
                catalog={itemList}
                data={[
                  itemList[currenItem],
                  (item) => {
                    setItemList({
                      ...itemList,
                      [currenItem]: item,
                    });
                  },
                ]}
              />
            ) : (
              ""
            )}
            <Scroll
              dir="vertical"
              batch={7}
              maxItems={7}
              height="550px"
              children={[
                ...Object.values(itemList).map((lootItem, i) => (
                  <DraggableItem
                    key={i}
                    data={lootItem}
                    type={ItemTypes.LOOT}
                    onClick={() => setCurrentItem(lootItem.id)}
                    style={
                      {
                        width: "32px",
                        height: "32px",
                        ...(lootItem.image
                          ? {
                              "background-image": "url(" + lootItem.image + ")",
                            }
                          : {}),
                      } as any
                    }
                  />
                )),
                <div
                  className="paperus button"
                  style={
                    {
                      width: "32px",
                      height: "32px",
                      "text-align": "center",
                      "font-size": "32px",
                    } as any
                  }
                  onClick={() => {
                    const id = Math.random().toString(36).substring(7);
                    setCurrentItem(id);
                    setItemList({
                      ...itemList,
                      [id]: {
                        ...defaultItem,
                        id,
                      },
                    });
                  }}
                >
                  +
                </div>,
              ]}
            />
          </div>

          <div>
            <div className="paperus">Writing</div>
            <Scroll
              dir="vertical"
              maxItems={1}
              width="700px"
              height={"1000px"}
              scale={0.2}
              children={[
                ...textData.map((t, i) => (
                  <Editor
                    data={[
                      t,
                      (d: string) => {
                        setTextData([
                          ...textData.slice(0, i),
                          d,
                          ...textData.slice(i + 1),
                        ]);
                      },
                    ]}
                  ></Editor>
                )),
                <div
                  className="paperus button"
                  style={{}}
                  onClick={() => {
                    setTextData([...textData, ""]);
                  }}
                >
                  Add new page?
                </div>,
              ]}
            />

            <img
              onClick={updateBackground}
              src={
                // convert from string
                theme.backGroundImage
              }
              style={{}}
              alt="background"
              className="background"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
