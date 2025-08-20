// components/ui/file-upload.tsx
"use client";

import * as React from "react";
import { useDropzone, type DropzoneProps } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
	value?: File[] | null;
	onValueChange?: (files: File[] | null) => void;
	dropzoneOptions?: Omit<DropzoneProps, "onDrop">;
	orientation?: "horizontal" | "vertical";
}

const FileUploader = React.forwardRef<HTMLDivElement, FileUploaderProps>(
	(
		{
			className,
			dropzoneOptions,
			value,
			onValueChange,
			orientation = "vertical",
			children,
			...props
		},
		ref,
	) => {
		const onDrop = React.useCallback(
			(acceptedFiles: File[]) => {
				const files = acceptedFiles;
				if (!files) {
					onValueChange?.(null);
					return;
				}
				onValueChange?.(files);
			},
			[onValueChange],
		);

		const { getRootProps, getInputProps, isDragActive } = useDropzone({
			onDrop,
			...dropzoneOptions,
		});

		return (
			<div
				ref={ref}
				{...getRootProps()}
				className={cn(
					"relative w-full cursor-pointer",
					orientation === "horizontal"
						? "flex flex-row gap-2"
						: "flex flex-col gap-2",
					className,
				)}
				{...props}
			>
				<input {...getInputProps()} />
				{children}
			</div>
		);
	},
);

FileUploader.displayName = "FileUploader";

const FileInput = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				"relative w-full rounded-lg  px-3 py-6 text-center hover:bg-muted/25",
				"ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
});

FileInput.displayName = "FileInput";

const FileUploaderContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ children, className }, ref) => {
	return (
		<div ref={ref} className={cn("w-full px-3", className)}>
			{children}
		</div>
	);
});

FileUploaderContent.displayName = "FileUploaderContent";

// ✅ POPRAWIONY INTERFEJS
interface FileUploaderItemProps extends React.HTMLAttributes<HTMLDivElement> {
	index: number;
	onRemove?: (index: number) => void;
	showRemoveButton?: boolean;
}

const FileUploaderItem = React.forwardRef<
	HTMLDivElement,
	FileUploaderItemProps
>(
	(
		{ className, index, children, onRemove, showRemoveButton = true, ...props },
		ref,
	) => {
		return (
			<div
				ref={ref}
				className={cn(
					"relative flex items-center justify-between gap-2 rounded-md border border-muted px-3 py-2 text-sm",
					className,
				)}
				{...props}
			>
				<div className="flex items-center gap-2">{children}</div>

				{/* PRZYCISK USUWANIA */}
				{showRemoveButton && onRemove && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onRemove(index);
						}}
						className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-destructive hover:bg-destructive/80 text-destructive-foreground flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
						aria-label="Usuń plik"
					>
						<X className="w-3 h-3" />
					</button>
				)}
			</div>
		);
	},
);

FileUploaderItem.displayName = "FileUploaderItem";

export { FileUploader, FileInput, FileUploaderContent, FileUploaderItem };
