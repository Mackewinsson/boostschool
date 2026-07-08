export type StudentContent = {
  metadata: {
    studentTitle: string;
    studentDescription: string;
    teacherTitle: string;
    teacherDescription: string;
  };
  portal: {
    backHome: string;
    myArea: string;
    teacherArea: string;
    signInTitle: string;
    signInSubtitle: string;
  };
  student: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyBody: string;
    openLabel: string;
    newBadge: string;
    markDone: string;
    markUndone: string;
    doneBadge: string;
  };
  teacher: {
    title: string;
    subtitle: string;
    addTitle: string;
    titleLabel: string;
    titlePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    urlLabel: string;
    urlPlaceholder: string;
    addButton: string;
    materialsTitle: string;
    materialsEmpty: string;
    searchPlaceholder: string;
    searchEmpty: string;
    deleteLabel: string;
    assignTitle: string;
    assignHint: string;
    studentLabel: string;
    studentPlaceholder: string;
    saveAssignments: string;
    assigned: string;
    notAssigned: string;
    assignAllLabel: string;
    completedLabel: string;
    successAdded: string;
    successAssigned: string;
    errorGeneric: string;
    errorUrl: string;
    errorTitle: string;
  };
};
