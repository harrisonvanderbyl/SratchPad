import { CSSProperties, ReactNode, useEffect, useState } from "react";
import "./scroll.scss";
export function Scroll({
  children = [],
  maxItems = 5,
  dir = "horizontal",
  height = "64px",
  width = "100%",
  scale = 0.5,
  batch = 1,
  updateOn = [],
}: {
  children?: React.ReactNode[];
  maxItems?: number;
  height?: number | string;
  width?: number | string;
  scale?: number;
  batch?: number;
  dir?: "vertical" | "horizontal";
  updateOn?: any[];
}) {
  const [currentCharScolled, setCurrentCharScolled] = useState(0);
  useEffect(() => {
    setCurrentCharScolled(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, updateOn);
  useEffect(() => {
    setCurrentCharScolled(
      Math.min(Math.max(0, currentCharScolled), children.length - maxItems)
    );
  }, [currentCharScolled, maxItems, children.length]);
  return (
    <div
      style={
        {
          ...(dir === "horizontal"
            ? ({
                display: "flex",
                "flex-wrap": "nowrap",

                borderLeft: `${
                  currentCharScolled > 0.1 ? 2 : 0
                }px solid #000000`,
                borderRight: `${
                  currentCharScolled < children.length - maxItems ? 2 : 0
                }px solid #000000`,
                // round the corners
              } as CSSProperties)
            : {
                "border-top": `${
                  currentCharScolled > 0.1 ? 2 : 0
                }px solid #000000`,
                "border-bottom": `${
                  currentCharScolled < children.length - maxItems ? 2 : 0
                }px solid #000000`,
              }),
          "border-radius": "2px",
          width,
          height,
        } as any
      }
      onWheel={(_) => {
        // stop scrolling
        _.stopPropagation();
        _.preventDefault();
        _.nativeEvent.stopImmediatePropagation();
        _.nativeEvent.preventDefault();
        _.nativeEvent.stopPropagation();
        //
        // fix through window

        const newScrollLocation = Math.min(
          Math.max(
            0,
            currentCharScolled +
              scale *
                Math.sign(
                  _[
                    ("delta" + (dir === "horizontal" ? "X" : "Y")) as
                      | "deltaX"
                      | "deltaY"
                  ]
                )
          ),
          children.length / batch - maxItems
        );
        //the width of the calling element
        // _.currentTarget.getBoundingClientRect()[
        //   dir === "horizontal" ? "width" : "height"
        // ];

        console.log(newScrollLocation);

        setCurrentCharScolled(newScrollLocation);
      }}
      className="scroll"
    >
      {children
        .reduce<ReactNode[][]>(
          (acc, curr) =>
            acc[acc.length - 1].length === batch
              ? [...acc, [curr]]
              : [
                  ...acc.slice(0, acc.length - 1),
                  [...acc[acc.length - 1], curr],
                ],
          [[]]
        )
        .map((c, i) => {
          // add class to node c
          return (
            <div
              style={
                {
                  display: "flex",
                  "flex-wrap": "wrap",
                  ...(dir === "horizontal"
                    ? {
                        minWidth: "calc(100% / " + maxItems + ")",
                        height: "100%",
                      }
                    : {
                        minHeight: "calc(100% / " + maxItems + ")",
                        width: "100%",
                      }),
                } as any
              }
              key={i}
              className={
                "slideItem" +
                (Math.floor(i) + 0.01 >= currentCharScolled + maxItems ||
                Math.floor(i) + 0.01 <= currentCharScolled
                  ? " hidden"
                  : "")
              }
            >
              {c.map((cm, i) => (
                <div
                  style={{
                    ...(dir === "horizontal"
                      ? {
                          height: "100%",
                          width: "100%",
                        }
                      : {
                          height: "100%",
                          width: "calc(100%/ " + batch + ")",
                          left: (i * 100) / batch + "%",
                        }),
                  }}
                  children={cm}
                />
              ))}
            </div>
          );
        })}
    </div>
  );
}
