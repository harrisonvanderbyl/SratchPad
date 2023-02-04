import { useState } from "react";
import { Generate } from "../../../scripts/generate";
import { InputField } from "../../inputs/Input";
import { Appearence } from "../Character.types";

const fillAppearence = (data: Partial<Appearence>): Appearence => {
  return {
    image: data.image,
    // set random height in normal human height range in cm
    height: data.height ?? Math.floor(Math.random() * 30 + 150),
    // set random weight in normal human weight range in kg
    weight: data.weight ?? Math.floor(Math.random() * 30 + 50),
    // set random age in normal human age range in years
    age: data.age ?? Math.floor(Math.random() * 30 + 15),
    // choose race randomly from list
    race:
      data.race ??
      ["Human", "Elf", "Dwarf", "Halfling"][Math.floor(Math.random() * 4)],
    // choose eye color randomly from list
    eyes:
      data.eyes ??
      ["Blue", "Green", "Brown", "Black", "Grey", "Hazel"][
        Math.floor(Math.random() * 6)
      ],
    // choose hair color randomly from list
    hair:
      data.hair ??
      ["Blonde", "Brown", "Black", "Red", "Grey", "White"][
        Math.floor(Math.random() * 6)
      ],
    gender:
      data.gender ??
      ["Male", "Female", "Non-Binary"][Math.floor(Math.random() * 3)],
  };
};

export function AppearenceSheet({
  data: [indata, setData],
  readonly = false,
}: {
  data: [Partial<Appearence>, (value: Appearence) => void];
  readonly?: boolean;
}) {
  const data = fillAppearence(indata);
  const [isLoading, setIsLoading] = useState(false);

  const createFace = () => {
    setIsLoading(true);
    Generate(
      `A fantasy painted face portrait of a ${data.gender} ${data.race} ${data.hair} hair, ${data.eyes} eyes, of age ${data.age} years old, ${data.weight}kg and ${data.height}cm tall`
    ).then((res) => {
      setIsLoading(false);
      if (res.length !== 0) {
        // if res[0] is an url, download it as base64 and set it as image
        if (res[0]?.startsWith("http")) {
          fetch(res[0])
            .then((res) => res.blob())
            .then((blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64data = reader.result;
                setData({ ...data, image: base64data as string });
              };
              reader.readAsDataURL(blob);
            });
        } else {
          setData({ ...data, image: res[0] || "" });
        }
      }
    });
  };

  // hash compare
  if (JSON.stringify(data) !== JSON.stringify(indata)) {
    setData(data);
  }
  return (
    <div className="appearence-sheet">
      <div style={{ display: "flex" } as any}>
        <div className="field">
          <div className="image">
            <div
              onClick={createFace}
              className={isLoading ? "spinning" : "paperus"}
              style={
                {
                  width: "150px",
                  height: "150px",
                  ...(data.image
                    ? {
                        "background-image": `url(${data.image})`,
                      }
                    : {}),
                  "background-size": "cover",
                } as any
              }
            />
          </div>
        </div>
        <div style={{ padding: "10px" }}>
          {Object.entries(data).map(([key, value]) =>
            key === "image" ? (
              ""
            ) : (
              <div>
                <b className="label">{key}</b>
              </div>
            )
          )}
        </div>
        <div style={{ padding: "10px" }}>
          {Object.entries(data).map(([key, value]) =>
            key === "image" ? (
              ""
            ) : (
              <div>
                <InputField
                  readonly={readonly}
                  data={[
                    typeof value == "number" ? value.toFixed(0) : value,
                    (value) => setData({ ...data, [key]: value }),
                  ]}
                  type={typeof value == "number" ? "number" : "text"}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
