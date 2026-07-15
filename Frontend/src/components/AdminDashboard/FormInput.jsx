import React from 'react';

export const FormInput = ({ label, name, register, error, placeholder, type = "text", ...props }) => (
  <div className="form-control w-full space-y-1.5 satoshi">
    <label className="text-sm font-bold tracking-wide text-foreground/90 uppercase text-[11px]">{label}</label>
    <input
      type={type}
      className={`input input-bordered w-full rounded-xl bg-card border border-border/80 text-foreground focus:ring-2 focus:ring-brand/40 text-sm h-11 ${error ? 'border-destructive/60 focus:ring-destructive/20' : ''}`}
      {...register(name)}
      placeholder={placeholder}
      {...props}
    />
    {error && <span className="text-xs font-semibold text-destructive mt-1 block">{error.message}</span>}
  </div>
);

export const FormTextArea = ({ label, name, register, error, placeholder, rows = 4, ...props }) => (
  <div className="form-control w-full space-y-1.5 satoshi">
    <label className="text-sm font-bold tracking-wide text-foreground/90 uppercase text-[11px]">{label}</label>
    <textarea
      rows={rows}
      className={`textarea textarea-bordered w-full rounded-xl bg-card border-border/80 text-foreground focus:ring-2 focus:ring-brand/40 text-sm p-3.5 resize-y leading-relaxed ${error ? 'border-destructive/60 focus:ring-destructive/20' : ''}`}
      {...register(name)}
      placeholder={placeholder}
      {...props}
    />
    {error && <span className="text-xs font-semibold text-destructive mt-1 block">{error.message}</span>}
  </div>
);