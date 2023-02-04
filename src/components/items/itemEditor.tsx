import { useState } from "react";
import { Generate } from "../../scripts/generate";
import { InputField } from "../inputs/Input";
import { ItemDropZone, Products } from "./itemdropzone/itemDropZone";

export type InventoryItem = {
  id: string;
  unique: boolean;
  image?: string;
  soulBound: boolean;
  name: string;
  importance: number;
  description: string;
  obtainString: string;
  giveString: string;
  activateString: string;

  additional_effect: string;
};

export type AlteredItem = InventoryItem & {
  tradeTransformID: Products;
  activeTransformID: Products;
  passiveContainsID: Products;
};

export const defaultItem: AlteredItem = {
  id: "",
  unique: false,
  image: "",
  soulBound: false,
  name: "Unknown Item",
  importance: 0,
  description: "An unknown item",
  activateString: "Item was used, but nothing happened",
  giveString: "Item was given away",
  obtainString: "Item was obtained",
  additional_effect: "",
  tradeTransformID: {},
  activeTransformID: {},
  passiveContainsID: {},
};

export const ItemEditor = ({
  data: [item, setItem] = [defaultItem, () => {}],
  catalog,
}: {
  data: [AlteredItem, (value: AlteredItem) => void];
  catalog: { [key: string]: AlteredItem };
}) => {
  const [Page, setPage] = useState(0);

  const createItem = () => {
    Generate(
      `An epic painting. Name: '${item.name}' Description: ${item.description}`
    ).then((res) => {
      if (res.length !== 0) {
        // if res[0] is an url, download it as base64 and set it as image
        if (res[0]?.startsWith("http")) {
          fetch(res[0])
            .then((res) => res.blob())
            .then((blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64data = reader.result;
                setItem({ ...item, image: base64data as string });
              };
              reader.readAsDataURL(blob);
            });
        } else {
          setItem({ ...item, image: res[0] || "" });
        }
      }
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
        }}
      >
        <div className="paperus">
          <InputField
            type="text"
            data={[item.name, (value) => setItem({ ...item, name: value })]}
          />
        </div>
        {["Details", "Effects"].map((name, i) => (
          <div className="paperus button" onClick={() => setPage(i)}>
            {name}
          </div>
        ))}
      </div>
      {
        [
          <div
            className="paperus"
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <div
              className="paperus"
              onClick={createItem}
              style={{
                height: "150px",
                width: "150px",
                ...(item.image
                  ? ({
                      "background-image": `url(${item.image})`,
                      "background-size": "cover",
                    } as any)
                  : {}),
              }}
            ></div>
            <div
              style={{
                display: "flex",
                padding: "10px",
              }}
            >
              <div>
                <div>
                  <b> Description </b>
                </div>
                <div>
                  <b> Activate </b>
                </div>
                <div>
                  <b> Give </b>
                </div>
                <div>
                  <b> Obtain </b>
                </div>
                <div>
                  <b> Effect </b>
                </div>
              </div>
              <div>
                <InputField
                  type="text"
                  data={[
                    item.description,
                    (value) => setItem({ ...item, description: value }),
                  ]}
                />
                <InputField
                  type="text"
                  data={[
                    item.activateString,
                    (value) => setItem({ ...item, activateString: value }),
                  ]}
                />
                <InputField
                  type="text"
                  data={[
                    item.giveString,
                    (value) => setItem({ ...item, giveString: value }),
                  ]}
                />
                <InputField
                  type="text"
                  data={[
                    item.obtainString,
                    (value) => setItem({ ...item, obtainString: value }),
                  ]}
                />
                <InputField
                  type="text"
                  data={[
                    item.additional_effect,
                    (value) => setItem({ ...item, additional_effect: value }),
                  ]}
                />
              </div>
            </div>
          </div>,
          <div>
            <div className="paperus">Effects</div>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div className="paperus" style={{ width: "150px" }}>
                Trade
              </div>
              <ItemDropZone
                catalog={catalog}
                data={[
                  item.tradeTransformID,
                  (value) => setItem({ ...item, tradeTransformID: value }),
                ]}
                dropDeps={[catalog, item]}
              ></ItemDropZone>
            </div>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div className="paperus" style={{ width: "150px" }}>
                Activate
              </div>
              <ItemDropZone
                catalog={catalog}
                data={[
                  item.activeTransformID,
                  (value) => setItem({ ...item, activeTransformID: value }),
                ]}
                dropDeps={[catalog, item]}
              ></ItemDropZone>
            </div>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div className="paperus" style={{ width: "150px" }}>
                Passive
              </div>
              <ItemDropZone
                catalog={catalog}
                data={[
                  item.passiveContainsID,
                  (value) => setItem({ ...item, passiveContainsID: value }),
                ]}
                dropDeps={[catalog, item]}
              ></ItemDropZone>
            </div>
          </div>,
        ][Page]
      }
    </div>
  );
};
