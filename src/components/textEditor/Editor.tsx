import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.scss";

export function Editor({
  data,
  readonly = false,
}: {
  readonly?: boolean;
  data: [string, (value: string) => void];
}) {
  const [value, setValue] = data;
  const modules = {
    toolbar: [
      // [{ header: [1, 2, false] }],
      [{ header: 1 }, { header: 2 }],

      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],

      ["link", "image"],
      ["clean"],
    ],
  };
  return (
    <div className={`editor ${readonly ? "readonly" : ""}`}>
      <ReactQuill
        readOnly={readonly}
        modules={modules}
        theme="snow"
        value={value}
        onChange={setValue}
      />
    </div>
  );
}
