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
				"relative w-full rounded-lg border-2 border-dashed border-muted-foreground/25 px-3 py-6 text-center hover:bg-muted/25",
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

const FileUploaderItem = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		index: number;
	}
>(({ className, index, children, ...props }, ref) => {
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
		</div>
	);
});

FileUploaderItem.displayName = "FileUploaderItem";

export { FileUploader, FileInput, FileUploaderContent, FileUploaderItem };
