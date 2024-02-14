const showError = (description) =>
    toast({
        title: "Error",
        description: description,
        variant: "destructive",
    });

const showInfo = (description) =>
    toast({
        title: "Info",
        description: description,
    });

const showSuccess = (description) =>
    toast({
        title: "",
        description: description,
    });
