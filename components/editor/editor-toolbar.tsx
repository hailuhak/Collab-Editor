"use client";

import { useState, useRef, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  RemoveFormatting,
  ImagePlus,
  Code2,
  Minus,
  Baseline,
  Unlink,
} from "lucide-react";

type EditorToolbarProps = {
  editor: Editor;
  canEdit: boolean;
};

const TEXT_COLORS = [
  { label: "Black", value: "#000000" },
  { label: "Dark gray", value: "#434343" },
  { label: "Red", value: "#d93025" },
  { label: "Orange", value: "#f4511e" },
  { label: "Yellow", value: "#f9ab00" },
  { label: "Green", value: "#188038" },
  { label: "Blue", value: "#1a73e8" },
  { label: "Purple", value: "#9334e6" },
  { label: "Pink", value: "#e91e63" },
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fde293" },
  { label: "Green", value: "#d7efd9" },
  { label: "Cyan", value: "#d2f4f7" },
  { label: "Blue", value: "#d3e3fd" },
  { label: "Red", value: "#f8d7d9" },
  { label: "Purple", value: "#e8daf6" },
];

function ToolButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`flex h-8 w-8 items-center justify-center rounded text-[#202124] transition hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent ${
        active ? "bg-[#e8f0fe] text-[#1a73e8] dark:bg-blue-950/60 dark:text-blue-400" : ""
      }`}
    >
      {children}
    </button>
  );
}

function ColorDropdown({
  label,
  icon,
  palette,
  active,
  onPick,
}: {
  label: string;
  icon: React.ReactNode;
  palette: { label: string; value: string }[];
  active?: boolean;
  onPick: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title={label}
        aria-label={label}
        className={`flex h-8 w-8 items-center justify-center rounded text-[#202124] transition hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800 ${
          active ? "bg-[#e8f0fe] text-[#1a73e8] dark:bg-blue-950/60 dark:text-blue-400" : ""
        }`}
      >
        {icon}
      </button>

      {open && (
        <div className="absolute left-0 top-9 z-50 w-44 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
            {label}
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {palette.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => {
                  onPick(c.value);
                  setOpen(false);
                }}
                className="flex h-7 w-7 items-center justify-center rounded border border-gray-100 hover:scale-110 transition dark:border-gray-700"
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditorToolbar({
  editor,
  canEdit,
}: EditorToolbarProps) {
  const [heading, setHeading] = useState("Normal text");

  // keep the heading select in sync with the cursor
  useEffect(() => {
    const update = () => {
      if (editor.isActive("heading", { level: 1 })) setHeading("Heading 1");
      else if (editor.isActive("heading", { level: 2 })) setHeading("Heading 2");
      else if (editor.isActive("heading", { level: 3 })) setHeading("Heading 3");
      else setHeading("Normal text");
    };
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const insertImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const insertDivider = () => {
    editor.chain().focus().setHorizontalRule().run();
  };

  const applyHeading = (value: string) => {
    if (value === "Normal text") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = Number(value.replace("Heading ", "")) as 1 | 2 | 3;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  return (
    <div className="relative border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-0.5 overflow-x-auto px-2 py-1.5 no-scrollbar">
        {/* History */}
        <ToolButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo() || !canEdit}
        >
          <Undo2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo() || !canEdit}
        >
          <Redo2 className="h-4 w-4" />
        </ToolButton>

        <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

        {/* Paragraph styles */}
        <select
          value={heading}
          onChange={(e) => applyHeading(e.target.value)}
          disabled={!canEdit}
          className="h-8 rounded border border-transparent bg-transparent px-2 text-sm font-medium text-[#202124] outline-none transition hover:bg-gray-100 focus:border-gray-300 disabled:opacity-50 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus:border-gray-600"
        >
          <option>Normal text</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
          <option>Heading 3</option>
        </select>

        <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

        {/* Inline formatting */}
        <ToolButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!canEdit}
        >
          <Bold className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!canEdit}
        >
          <Italic className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!canEdit}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!canEdit}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolButton>

        <ColorDropdown
          label="Text color"
          icon={<Baseline className="h-4 w-4" />}
          palette={TEXT_COLORS}
          active={editor.isActive("textStyle", { color: "#1a73e8" })}
          onPick={(value) =>
            editor.chain().focus().setColor(value).run()
          }
        />

        <ColorDropdown
          label="Highlight"
          icon={<Highlighter className="h-4 w-4" />}
          palette={HIGHLIGHT_COLORS}
          onPick={(value) =>
            editor.chain().focus().setHighlight({ color: value }).run()
          }
        />

        <ToolButton
          title="Clear formatting"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          disabled={!canEdit}
        >
          <RemoveFormatting className="h-4 w-4" />
        </ToolButton>

        <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

        {/* Links */}
        <ToolButton
          title="Insert link"
          onClick={setLink}
          disabled={!canEdit}
        >
          <Link2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          title="Remove link"
          onClick={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
          disabled={!editor.isActive("link")}
        >
          <Unlink className="h-4 w-4" />
        </ToolButton>

        <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

        {/* Alignment */}
        <ToolButton
          title="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          disabled={!canEdit}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          title="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          disabled={!canEdit}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          title="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          disabled={!canEdit}
        >
          <AlignRight className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          title="Justify"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          disabled={!canEdit}
        >
          <AlignJustify className="h-4 w-4" />
        </ToolButton>

        <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

        {/* Lists */}
        <ToolButton
          title="Bulleted list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!canEdit}
        >
          <List className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!canEdit}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          title="Checklist"
          active={editor.isActive("taskList")}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          disabled={!canEdit}
        >
          <ListChecks className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!canEdit}
        >
          <Quote className="h-4 w-4" />
        </ToolButton>

        <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

        {/* Insert */}
        <ToolButton title="Insert image" onClick={insertImage} disabled={!canEdit}>
          <ImagePlus className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Insert code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} disabled={!canEdit}>
          <Code2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton title="Insert divider" onClick={insertDivider} disabled={!canEdit}>
          <Minus className="h-4 w-4" />
        </ToolButton>
      </div>
    </div>
  );
}
