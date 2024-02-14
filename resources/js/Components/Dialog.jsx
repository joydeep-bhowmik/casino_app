import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Dialog({
    children,
    title = "Are you absolutely sure?",
    onConfirm = () => {},
    onCancel = () => {},
    confirmLabel = "Continue",
    cancelLabel = "Cancel",
    description,
    disabled = false,
}) {
    return (
        <AlertDialog>
            {children ? (
                <AlertDialogTrigger>{children}</AlertDialogTrigger>
            ) : (
                ""
            )}
            <AlertDialogContent>
                <AlertDialogHeader>
                    {title.length ? (
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                    ) : (
                        ""
                    )}
                    {description.length ? (
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    ) : (
                        ""
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {cancelLabel.length ? (
                        <AlertDialogCancel
                            onClick={() => {
                                onCancel();
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                    ) : (
                        ""
                    )}
                    {confirmLabel.length ? (
                        <AlertDialogAction
                            onClick={() => {
                                onConfirm();
                            }}
                        >
                            Continue
                        </AlertDialogAction>
                    ) : (
                        ""
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
