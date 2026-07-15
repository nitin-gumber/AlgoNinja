import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Editor from "@monaco-editor/react";
import { useProblemStore } from "../store/useProblemStore";
import { useThemeStore } from "../store/useThemeStore";
import { FormInput, FormTextArea } from "../components/AdminDashboard/FormInput";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Sparkles,
  Code2,
  CheckCircle2,
  Terminal,
  FlaskConical,
  BookOpen,
  Tag,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

import { problemValidationSchema } from "../validations/validation-schema";
import { LANGUAGES, MONACO_LANG_MAP } from "../utils/constants";
import { SAMPLE_DATA } from "../utils/sampleProblemsData";
import { Section } from "../components/AdminDashboard/Section";

export const AddProblemPage = () => {
  const navigate = useNavigate();
  const { createProblem, isLoading } = useProblemStore();
  const { isDarkMode } = useThemeStore();
  const [activeCodeLang, setActiveCodeLang] = useState("JAVASCRIPT");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemValidationSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "easy",
      constraints: "",
      tags: [""],
      testcases: [{ input: "", output: "" }],
      examples: [{ input: "", output: "", explanation: "" }],
      codeSnippets: {
        JAVASCRIPT: SAMPLE_DATA.codeSnippets.JAVASCRIPT,
        PYTHON: SAMPLE_DATA.codeSnippets.PYTHON,
        JAVA: SAMPLE_DATA.codeSnippets.JAVA,
      },
      referenceSolutions: { JAVASCRIPT: "", PYTHON: "", JAVA: "" },
    },
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: "tags" });
  const { fields: testcaseFields, append: appendTestcase, remove: removeTestcase } = useFieldArray({ control, name: "testcases" });
  const { fields: exampleFields, append: appendExample, remove: removeExample, replace: replaceExamples } = useFieldArray({ control, name: "examples" });

  const handleLoadSample = () => {
    setValue("title", SAMPLE_DATA.title);
    setValue("description", SAMPLE_DATA.description);
    setValue("difficulty", SAMPLE_DATA.difficulty);
    setValue("tags", SAMPLE_DATA.tags);
    setValue("constraints", SAMPLE_DATA.constraints);
    setValue("codeSnippets", SAMPLE_DATA.codeSnippets);
    setValue("referenceSolutions", SAMPLE_DATA.referenceSolutions);

    if (SAMPLE_DATA.examples) {
      const transformedExamples = Object.keys(SAMPLE_DATA.examples).map((key) => ({
        input: SAMPLE_DATA.examples[key].input || "",
        output: SAMPLE_DATA.examples[key].output || "",
        explanation: SAMPLE_DATA.examples[key].explanation || "",
      }));
      replaceExamples(transformedExamples);
    }
    toast.success("Sample data loaded successfully!");
  };

  const onSubmit = async (formData) => {
    const formattedExamples = {};
    formData.examples.forEach((ex, index) => {
      formattedExamples[`Example ${index + 1}`] = {
        input: ex.input,
        output: ex.output,
        explanation: ex.explanation || "",
      };
    });

    const finalPayload = {
      ...formData,
      examples: formattedExamples,
    };

    const response = await createProblem(finalPayload);
    if (response?.success) {
      navigate("/admin-dashboard");
    }
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground transition-colors duration-300 py-10 px-4 relative overflow-hidden pt-16"
      style={{
        backgroundColor: isDarkMode ? "#0a0a0a" : "var(--color-background)",
      }}
    >
      {/* ── Match UI Accent: Reddish Light Blur Core Background Accent ── */}
      <div
        className="absolute top-0 right-1/3 translate-x-1/2 w-150 h-65 pointer-events-none z-0 transition-opacity duration-500 rounded-full"
        style={{
          background: isDarkMode
            ? `radial-gradient(circle, oklch(0.6 0.25 25 / 8%) 0%, transparent 80%)`
            : `radial-gradient(circle, oklch(0.6 0.25 25 / 3%) 0%, transparent 80%)`,
        }}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto px-4 md:px-8 space-y-8 satoshi relative z-10 animate-in fade-in duration-300"
      >
        {/* Page Main Header */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/20 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5 arp-display">
              <Plus className="h-6 w-6 text-brand stroke-3" />
              <span>Add new problem</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Create a brand new coding challenge. Solutions are validated across your sandbox cluster before changes apply.
            </p>
          </div>
          <Link to="/admin-dashboard" className="shrink-0">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-card border border-border/80 text-foreground hover:bg-muted/80 transition-all duration-150 active:scale-95 shadow-sm h-10 cursor-pointer satoshi"
            >
              <ArrowLeft className="h-4 w-4 text-brand" />
              <span>Back to Dashboard</span>
            </button>
          </Link>
        </div>

        {/* Load sample banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-brand/20 bg-brand/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Load a complete sample</p>
              <p className="text-xs text-muted-foreground">
                Populates fields instantly with an introductory dynamic programming task layout context.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLoadSample}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl border border-brand/40 bg-card text-brand hover:bg-brand/5 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Load sample
          </button>
        </div>

        {/* ── SECTION 1 — Main Problem Details ── */}
        <Section icon={BookOpen} title="Problem Details">
          <div className="space-y-5">
            <FormInput
              label="Title"
              name="title"
              register={register}
              error={errors.title}
              placeholder="e.g., Longest Common Subsequence"
            />

            <div className="form-control w-full space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Difficulty
              </label>
              <div className="relative">
                <select
                  {...register("difficulty")}
                  className="w-full rounded-xl border border-border/80 bg-card px-4 py-2.5 text-sm text-foreground appearance-none pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50 transition-all h-11 cursor-pointer"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              {errors.difficulty && (
                <span className="text-xs font-semibold text-destructive mt-1 block">
                  {errors.difficulty.message}
                </span>
              )}
            </div>

            <FormTextArea
              label="Description"
              name="description"
              register={register}
              error={errors.description}
              placeholder="Provide objective specifications clearly..."
              rows={8}
            />
          </div>
        </Section>

        {/* ── SECTION 2 — Topic Tags ── */}
        <Section
          icon={Tag}
          title="Tags"
          badge={
            <button
              type="button"
              onClick={() => appendTag("")}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add tag
            </button>
          }
        >
          <div className="flex flex-wrap gap-2">
            {tagFields.map((field, idx) => (
              <div
                key={field.id}
                className="flex items-center gap-1 rounded-xl border border-border/60 bg-muted/20 pl-3 pr-1.5 py-1.5"
              >
                <input
                  {...register(`tags.${idx}`)}
                  placeholder="e.g., array"
                  className="bg-transparent text-sm font-medium focus:outline-none w-24 text-foreground placeholder:text-muted-foreground/40"
                />
                <button
                  type="button"
                  onClick={() => tagFields.length > 1 && removeTag(idx)}
                  disabled={tagFields.length === 1}
                  className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-30"
                  aria-label="Remove tag"
                >
                  <Trash2 className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
          {errors.tags && (
            <p className="mt-2 text-xs font-semibold text-destructive">
              {errors.tags.message}
            </p>
          )}
        </Section>

        {/* ── SECTION 3 — Rendering Examples ── */}
        <Section
          icon={FlaskConical}
          title="Problem Examples Matrix"
          badge={
            <button
              type="button"
              onClick={() =>
                appendExample({ input: "", output: "", explanation: "" })
              }
              className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Add Example</span>
            </button>
          }
        >
          <div className="space-y-6">
            {exampleFields.map((field, idx) => (
              <div
                key={field.id}
                className="rounded-xl border border-border/40 bg-muted/10 overflow-hidden relative group animate-in fade-in duration-200"
              >
                <div className="px-4 py-2.5 border-b border-border/30 bg-muted/20 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Example #{idx + 1}{" "}
                    {idx > 0 && (
                      <span className="ml-1 text-muted-foreground/50 lowercase tracking-normal font-medium">
                        (optional)
                      </span>
                    )}
                  </span>

                  {exampleFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExample(idx)}
                      className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Remove this example panel"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Input Parameters Example"
                    name={`examples.${idx}.input`}
                    register={register}
                    error={errors.examples?.[idx]?.input}
                    placeholder="e.g., nums = [2,7,11], target = 9"
                  />
                  <FormInput
                    label="Expected Evaluation Output"
                    name={`examples.${idx}.output`}
                    register={register}
                    error={errors.examples?.[idx]?.output}
                    placeholder="e.g., [0,1]"
                  />
                  <div className="sm:col-span-2">
                    <FormTextArea
                      label="Algorithmic Dry-Run Explanation"
                      name={`examples.${idx}.explanation`}
                      register={register}
                      error={errors.examples?.[idx]?.explanation}
                      placeholder="Provide clean human readable runtime logic trace mapping analysis text..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.examples && !Array.isArray(errors.examples) && (
            <p className="mt-2 text-xs font-semibold text-destructive">
              {errors.examples.message}
            </p>
          )}
        </Section>

        {/* ── SECTION 4 — Testcases ── */}
        <Section
          icon={Terminal}
          title="Testcases"
          badge={
            <button
              type="button"
              onClick={() => appendTestcase({ input: "", output: "" })}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add testcase
            </button>
          }
        >
          <div className="space-y-4">
            {testcaseFields.map((field, idx) => (
              <div
                key={field.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_40px] gap-4 items-end bg-muted/5 border border-border/40 p-4 rounded-xl relative group"
              >
                <FormTextArea
                  label={`Testcase #${idx + 1} Input (stdin)`}
                  name={`testcases.${idx}.input`}
                  register={register}
                  error={errors.testcases?.[idx]?.input}
                  rows={2}
                  placeholder="Input datasets..."
                />
                <FormTextArea
                  label="Expected output"
                  name={`testcases.${idx}.output`}
                  register={register}
                  error={errors.testcases?.[idx]?.output}
                  rows={2}
                  placeholder="Expected output evaluation result..."
                />
                <div className="flex justify-end pb-1">
                  <button
                    type="button"
                    onClick={() =>
                      testcaseFields.length > 1 && removeTestcase(idx)
                    }
                    disabled={testcaseFields.length === 1}
                    className="h-11 w-11 flex items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all cursor-pointer disabled:opacity-20"
                    aria-label={`Remove testcase ${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
            {errors.testcases && !Array.isArray(errors.testcases) && (
              <p className="text-xs font-semibold text-destructive">
                {errors.testcases.message}
              </p>
            )}
          </div>
        </Section>

        {/* ── SECTION 5 — Monaco Multi-language Workspaces ── */}
        <Section icon={Code2} title="Code Editor">
          <div className="space-y-6">
            <div className="flex gap-1 p-1 rounded-xl bg-muted/40 border border-border/40 w-fit">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveCodeLang(lang)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${activeCodeLang === lang ? "bg-brand text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {LANGUAGES.map((lang) => {
              if (lang !== activeCodeLang) return null;
              const monacoLang = MONACO_LANG_MAP[lang];

              return (
                <div
                  key={lang}
                  className="space-y-5 animate-in fade-in duration-150"
                >
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-1.5">
                      Starter snippet — shown to users
                    </label>
                    <div className="rounded-xl border border-border/60 overflow-hidden">
                      <Controller
                        name={`codeSnippets.${lang}`}
                        control={control}
                        render={({ field }) => (
                          <Editor
                            height="260px"
                            language={monacoLang}
                            theme={isDarkMode ? "vs-dark" : "light"}
                            value={field.value}
                            onChange={field.onChange}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 13,
                              automaticLayout: true,
                              scrollBeyondLastLine: false,
                              lineNumbers: "on",
                              wordWrap: "on",
                            }}
                          />
                        )}
                      />
                    </div>
                    {errors.codeSnippets?.[lang] && (
                      <p className="mt-1 text-xs font-semibold text-destructive">
                        {errors.codeSnippets[lang].message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-brand mb-1.5">
                      Reference solution — validated against testcases
                    </label>
                    <div className="rounded-xl border border-brand/30 overflow-hidden">
                      <div className="px-3 py-1.5 bg-brand/5 border-b border-brand/20">
                        <span className="text-xs font-bold text-brand uppercase tracking-widest">
                          Admin only · not shown to users
                        </span>
                      </div>
                      <Controller
                        name={`referenceSolutions.${lang}`}
                        control={control}
                        render={({ field }) => (
                          <Editor
                            height="280px"
                            language={monacoLang}
                            theme={isDarkMode ? "vs-dark" : "light"}
                            value={field.value}
                            onChange={field.onChange}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 13,
                              automaticLayout: true,
                              scrollBeyondLastLine: false,
                              lineNumbers: "on",
                              wordWrap: "on",
                            }}
                          />
                        )}
                      />
                    </div>
                    {errors.referenceSolutions?.[lang] && (
                      <p className="mt-1 text-xs font-semibold text-destructive">
                        {errors.referenceSolutions[lang].message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ── SECTION 6 — Metric Constraints Limits ── */}
        <Section icon={BookOpen} title="Additional Details">
          <div className="space-y-6">
            <FormTextArea
              label="Constraints"
              name="constraints"
              register={register}
              error={errors.constraints}
              rows={4}
              className="text-base p-4 border-border/80 bg-card rounded-xl w-full leading-relaxed"
            />
          </div>
        </Section>

        {/* Form Submission Action Control */}
        <div className="flex items-center justify-center pt-6 border-t border-border/30">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2.5 px-12 py-4 font-bold text-base text-white bg-brand rounded-xl hover:opacity-95 transition-all active:scale-[0.97] shadow-xl shadow-brand/10 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none cursor-pointer tracking-wide w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner text-white w-5 h-5"></span>
                <span>Compiling reference solution matrix...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
                <span>Create Problem</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};