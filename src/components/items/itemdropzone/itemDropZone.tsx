import { useDrop } from "react-dnd";
import { ItemTypes } from "../../items/draggableItem";
import { AlteredItem } from "../../items/itemEditor";
import { Scroll } from "../../scroll/scroll";

export type Products = {
  [key: string]: {
    itemID: string;
    number: number;
  };
};

export const ItemDropZone = ({
  data: [products, setProducts] = [{}, () => ({})],
  dropDeps,
  catalog,
}: {
  data: [Products, (value: Products) => void];
  dropDeps?: any[];
  catalog: { [key: string]: AlteredItem };
}) => {
  const removeEmpties = (obj: Products) => {
    const newObj: Products = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key].number !== 0) {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  };

  const dropHandler = (mult: number) => (item: AlteredItem) => {
    setProducts(
      removeEmpties({
        ...products,
        [item.id]: {
          itemID: item.id,
          number: (products[item.id]?.number ?? 0) + mult,
        },
      })
    );
  };
  const [__, dropAdd] = useDrop(
    () => ({
      accept: ItemTypes.LOOT,
      drop: dropHandler(1),
    }),
    dropDeps
  );
  const [_, dropRem] = useDrop(
    () => ({
      accept: ItemTypes.LOOT,
      drop: dropHandler(-1),
    }),
    dropDeps
  );
  return (
    <div style={{ height: "64px", width: "100%", position: "relative" }}>
      <div
        ref={dropAdd}
        style={{
          height: "100%",
          width: "50%",
          position: "absolute",
          top: "0px",
          left: "0px",
          zIndex: 30,
          border: "3px dotted green",
        }}
      ></div>
      <div
        ref={dropRem}
        style={{
          height: "100%",
          width: "45%",
          position: "absolute",
          top: "0px",
          right: "0px",
          zIndex: 30,
          border: "3px dotted red",
        }}
      ></div>
      <Scroll
        width="100%"
        height="100%"
        maxItems={5}
        dir="horizontal"
        children={[
          ...Object.values(products).map((item, index) => {
            return (
              <div
                className="paperus hover-large"
                style={
                  {
                    "min-height": "24px",
                    ...(catalog?.[item.itemID]?.image
                      ? {
                          "background-image": `url(${
                            catalog[item.itemID].image
                          })`,
                        }
                      : {}),
                  } as any
                }
              >
                <div
                  className="paperus"
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    top: "-20px",
                    right: "-16px",
                    padding: "10px",
                    margin: "0px",
                    // paddingLeft: 8 * ("" + item.number).length + "px",
                    scale: "0.6",
                  }}
                >
                  {item.number ?? 0}
                </div>
              </div>
            );
          }),
        ]}
      />
    </div>
  );
};
