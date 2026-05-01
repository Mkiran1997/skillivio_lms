import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ----- API URL -----
const API_URL = "/api/enrollment";
const BULK_IMPORT_CHUNK_SIZE = 100;

function normalizeLookupValue(value) {
    return String(value || "").trim().toLowerCase();
}

function normalizeBoolean(value) {
    const normalized = normalizeLookupValue(value);
    return ["yes", "y", "true", "1"].includes(normalized);
}

function normalizeMode(value) {
    const normalized = normalizeLookupValue(value);

    if (normalized.includes("face")) return "face-to-face";
    if (normalized.includes("workplace")) return "workplace-based";
    return "blended";
}

function buildEnrollmentLookupKey(courseId, learnerId) {
    const normalizedCourseId = String(courseId || "").trim();
    const normalizedLearnerId = String(learnerId || "").trim();

    if (!normalizedCourseId || !normalizedLearnerId) {
        return null;
    }

    return `${normalizedCourseId}:${normalizedLearnerId}`;
}

async function postEnrollment(enrollmentData) {
    const isFormData = enrollmentData instanceof FormData;
    const response = await fetch(API_URL, {
        method: "POST",
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        body: isFormData ? enrollmentData : JSON.stringify(enrollmentData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }

    return response.json();
}

async function deleteEnrollmentRequest(id) {
    const response = await fetch(`/api/enrollment/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }

    return response.json();
}

function createBulkImportState() {
    return {
        jobId: null,
        status: "idle",
        fileName: "",
        total: 0,
        processed: 0,
        created: 0,
        skipped: 0,
        currentChunk: 0,
        totalChunks: 0,
        failures: [],
        error: null,
        startedAt: null,
        finishedAt: null,
    };
}

function createBulkImportAbortError(message, details = {}) {
    const error = new Error(message);
    error.name = "BulkImportAbortError";
    error.bulkImportDetails = details;
    return error;
}

function buildEnrollmentImportPayload({
    row,
    rowNumber,
    currentChunk,
    currentTenantId,
    currentUserName,
    courseLookup,
    learnerLookup,
    importKeys,
}) {
    const courseLabel = row["Course Title"] || row["Course"] || row["Course ID"];
    const learnerLabel =
        row["Learner Email"] || row["Email"] || row["ID Number"];
    const courseKey = normalizeLookupValue(courseLabel);
    const learnerKey = normalizeLookupValue(learnerLabel);

    if (!courseKey) {
        throw createBulkImportAbortError(
            `Row ${rowNumber}: missing Course Title or Course ID.`,
            { currentChunk },
        );
    }

    if (!learnerKey) {
        throw createBulkImportAbortError(
            `Row ${rowNumber}: missing Learner Email or ID Number.`,
            { currentChunk },
        );
    }

    const matchedCourse = courseLookup.get(courseKey);
    if (!matchedCourse) {
        throw createBulkImportAbortError(
            `Row ${rowNumber}: course "${courseLabel}" was not found for this tenant.`,
            { currentChunk },
        );
    }

    const matchedLearner = learnerLookup.get(learnerKey);
    if (!matchedLearner) {
        throw createBulkImportAbortError(
            `Row ${rowNumber}: learner "${learnerLabel}" was not found.`,
            { currentChunk },
        );
    }

    const duplicateKey = buildEnrollmentLookupKey(
        matchedCourse?._id,
        matchedLearner?._id,
    );
    if (duplicateKey && importKeys.has(duplicateKey)) {
        throw createBulkImportAbortError(
            `Row ${rowNumber}: learner is already enrolled in "${matchedCourse?.title}".`,
            { currentChunk },
        );
    }

    const intakeNumber = String(
        row["Intake No"] || row["Intake Number"] || "",
    ).trim();
    if (!intakeNumber) {
        throw createBulkImportAbortError(`Row ${rowNumber}: missing Intake No.`, {
            currentChunk,
        });
    }

    if (duplicateKey) {
        importKeys.add(duplicateKey);
    }

    const startDate = row["Start Date"] || new Date().toISOString();
    const plannedEndDate = row["End Date"] || null;

    return {
        duplicateKey,
        payload: {
            courseId: matchedCourse._id,
            learnerId: matchedLearner._id,
            tenantId: currentTenantId,
            qualification: {
                saqaId: String(
                    row["SAQA ID"] || matchedCourse?.saqaId || "",
                ).trim(),
                nqfLevel:
                    Number(
                        row["NQF"] ||
                            row["NQF Level"] ||
                            matchedCourse?.nqfLevel ||
                            matchedCourse?.nqf ||
                            0,
                    ) || 0,
                credits:
                    Number(row["Credits"] || matchedCourse?.credits || 0) || 0,
                intakeNumber,
                startDate,
                plannedEndDate,
                deliveryMode: normalizeMode(row["Mode"]),
            },
            declaration: {
                agreed: normalizeBoolean(row["Declaration"]),
                name: matchedLearner?.userId?.name || "",
                date: startDate,
            },
            popiaConsent: {
                granted: normalizeBoolean(row["POPIA"]),
                date: startDate,
            },
            provider: {
                representativeName: currentUserName || "",
                approvalDate: startDate,
            },
            status: normalizeLookupValue(row["Status"]) || "draft",
        },
    };
}

// ----- Async Thunks -----

export const fetchEnrollment = createAsyncThunk(
    "enrollment/fetchEnrollment",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }
            return await response.json();
        } catch (err) {
            return rejectWithValue({ error: err.message });
        }
    }
);

export const createEnrollment = createAsyncThunk(
    "enrollment/createEnrollment",
    async (enrollmentData, { rejectWithValue }) => {
        try {
            return await postEnrollment(enrollmentData);
        } catch (err) {
            return rejectWithValue(err?.error ? err : { error: err.message });
        }
    }
);

export const updateEnrollment = createAsyncThunk(
    "enrollment/updateEnrollment",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const isFormData = updatedData instanceof FormData;
            const response = await fetch(`/api/enrollment/${id}`, {
                method: "PUT",
                headers: isFormData ? {} : { "Content-Type": "application/json" },
                body: isFormData ? updatedData : JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }

            return await response.json();
        } catch (error) {
            return rejectWithValue({ error: error.message });
        }
    }
);

export const deleteEnrollment = createAsyncThunk(
    "enrollment/deleteEnrollment",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/enrollment/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }

            return id; // return deleted id
        } catch (err) {
            return rejectWithValue({ error: err.message });
        }
    }
);

export const importEnrollmentInChunks = createAsyncThunk(
    "enrollment/importEnrollmentInChunks",
    async (jobData, { dispatch, getState, rejectWithValue }) => {
        try {
            const activeStatus = getState()?.enrollment?.bulkImport?.status;
            if (activeStatus === "running") {
                return rejectWithValue({
                    error: "Another bulk enrolment import is already running.",
                });
            }

            const {
                fileName,
                rows = [],
                currentTenantId,
                currentTenantSlug,
                currentUserName,
            } = jobData || {};

            if (!currentTenantId) {
                return rejectWithValue({
                    error: "Tenant context is missing. Please refresh and try again.",
                });
            }

            if (!rows.length) {
                return rejectWithValue({
                    error: "The selected spreadsheet is empty.",
                });
            }

            const state = getState();
            const courses = state?.course?.Course || [];
            const learners = state?.learners?.Learners || [];
            const existingEnrollments = state?.enrollment?.Enrollment || [];

            const tenantCourses = courses.filter(
                (courseItem) => courseItem?.type === currentTenantSlug,
            );
            const tenantLearners = learners.filter((learner) => {
                const learnerTenantId = learner?.tenantId || learner?.userId?.tenantId;
                const normalizedLearnerTenantId =
                    typeof learnerTenantId === "string"
                        ? learnerTenantId
                        : learnerTenantId?._id || learnerTenantId?.id;

                if (normalizedLearnerTenantId && currentTenantId) {
                    return String(normalizedLearnerTenantId) === String(currentTenantId);
                }

                return learner?.userId?.tenantId?.slug === currentTenantSlug;
            });

            const courseLookup = new Map();
            tenantCourses.forEach((courseItem) => {
                [courseItem?._id, courseItem?.id, courseItem?.title].forEach((identifier) => {
                    const key = normalizeLookupValue(identifier);
                    if (key) {
                        courseLookup.set(key, courseItem);
                    }
                });
            });

            const learnerLookup = new Map();
            tenantLearners.forEach((learner) => {
                [
                    learner?.userId?.email,
                    learner?.contact?.altEmail,
                    learner?.demographics?.idNumber,
                ].forEach((identifier) => {
                    const key = normalizeLookupValue(identifier);
                    if (key) {
                        learnerLookup.set(key, learner);
                    }
                });
            });

            const importKeys = new Set(
                existingEnrollments
                    .map((record) =>
                        buildEnrollmentLookupKey(
                            record?.courseId?._id || record?.courseId,
                            record?.learnerId?._id || record?.learnerId,
                        ),
                    )
                    .filter(Boolean),
            );

            const totalChunks = Math.ceil(rows.length / BULK_IMPORT_CHUNK_SIZE);
            const startedAt = new Date().toISOString();
            const jobId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

            dispatch(
                bulkEnrollmentImportStarted({
                    jobId,
                    fileName,
                    total: rows.length,
                    totalChunks,
                    startedAt,
                }),
            );

            let processed = 0;
            let created = 0;
            let skipped = 0;
            const failures = [];
            const createdEnrollmentIds = [];
            const preparedRows = [];
            const pendingImportKeys = new Set(importKeys);

            for (
                let chunkStartIndex = 0;
                chunkStartIndex < rows.length;
                chunkStartIndex += BULK_IMPORT_CHUNK_SIZE
            ) {
                const chunkRows = rows.slice(
                    chunkStartIndex,
                    chunkStartIndex + BULK_IMPORT_CHUNK_SIZE,
                );
                const currentChunk = Math.floor(chunkStartIndex / BULK_IMPORT_CHUNK_SIZE) + 1;
                for (let rowIndex = 0; rowIndex < chunkRows.length; rowIndex += 1) {
                    const rowNumber = chunkStartIndex + rowIndex + 2;

                    try {
                        preparedRows.push({
                            currentChunk,
                            rowNumber,
                            ...buildEnrollmentImportPayload({
                                row: chunkRows[rowIndex],
                                rowNumber,
                                currentChunk,
                                currentTenantId,
                                currentUserName,
                                courseLookup,
                                learnerLookup,
                                importKeys: pendingImportKeys,
                            }),
                        });
                    } catch (errorData) {
                        failures.push(
                            errorData?.message || "Bulk enrolment import failed.",
                        );
                    }
                }
            }

            if (failures.length > 0) {
                throw createBulkImportAbortError(
                    `${failures.length} error(s) found in the import file. Fix them and try again.`,
                    {
                        processed: rows.length,
                        created: 0,
                        skipped: failures.length,
                        currentChunk: totalChunks,
                        failures: [...failures],
                    },
                );
            }

            processed = 0;
            skipped = 0;
            failures.length = 0;

            for (const item of preparedRows) {
                try {
                    const createdEnrollment = await postEnrollment(item.payload);
                    createdEnrollmentIds.push(
                        createdEnrollment?._id || createdEnrollment?.id,
                    );
                    processed += 1;
                    created += 1;
                    dispatch(
                        bulkEnrollmentImportProgress({
                            processed,
                            created,
                            skipped,
                            currentChunk: item.currentChunk,
                            failures,
                        }),
                    );
                } catch (errorData) {
                    failures.push(
                        `Row ${item.rowNumber}: ${errorData?.error || errorData?.message || "unable to create enrollment."}`,
                    );
                    processed += 1;
                    skipped += 1;
                    dispatch(
                        bulkEnrollmentImportProgress({
                            processed,
                            created,
                            skipped,
                            currentChunk: item.currentChunk,
                            failures,
                        }),
                    );
                }
            }

            if (failures.length > 0) {
                const rollbackFailures = [];
                for (const enrollmentId of createdEnrollmentIds) {
                    if (!enrollmentId) continue;

                    try {
                        await deleteEnrollmentRequest(enrollmentId);
                    } catch (rollbackError) {
                        rollbackFailures.push(
                            `Rollback failed for enrollment ${enrollmentId}: ${rollbackError?.error || rollbackError?.message || "unable to delete created enrollment."}`,
                        );
                    }
                }

                const rollbackCompleted = rollbackFailures.length === 0;
                created = rollbackCompleted ? 0 : rollbackFailures.length;

                if (createdEnrollmentIds.length > 0) {
                    await dispatch(fetchEnrollment());
                }

                throw createBulkImportAbortError(
                    rollbackCompleted
                        ? `${failures.length} error(s) found during import. No enrollments were saved.`
                        : `${failures.length} error(s) found during import and rollback could not fully complete.`,
                    {
                        processed,
                        created,
                        skipped,
                        currentChunk: totalChunks,
                        failures: [...failures, ...rollbackFailures],
                    },
                );
            }

            if (created > 0) {
                dispatch(fetchEnrollment());
            }

            dispatch(
                bulkEnrollmentImportCompleted({
                    processed,
                    created,
                    skipped,
                    failures,
                    finishedAt: new Date().toISOString(),
                }),
            );

            return {
                processed,
                created,
                skipped,
                failures,
            };
        } catch (err) {
            const bulkImportDetails = err?.bulkImportDetails || {};
            const error = err?.error || err?.message || "Bulk enrolment import failed.";
            dispatch(
                bulkEnrollmentImportFailed({
                    error,
                    processed: bulkImportDetails?.processed,
                    created: bulkImportDetails?.created,
                    skipped: bulkImportDetails?.skipped,
                    currentChunk: bulkImportDetails?.currentChunk,
                    failures: bulkImportDetails?.failures,
                    finishedAt: new Date().toISOString(),
                }),
            );
            return rejectWithValue({ error });
        }
    },
);

// ----- Initial State -----
const initialState = {
    Enrollment: [],
    loading: false,
    error: null,
    bulkImport: createBulkImportState(),
};

// ----- Slice -----
const enrollmentSlice = createSlice({
    name: "enrollment",
    initialState,
    reducers: {
        bulkEnrollmentImportStarted: (state, action) => {
            state.bulkImport = {
                ...createBulkImportState(),
                jobId: action.payload?.jobId || null,
                status: "running",
                fileName: action.payload?.fileName || "",
                total: action.payload?.total || 0,
                totalChunks: action.payload?.totalChunks || 0,
                startedAt: action.payload?.startedAt || null,
            };
        },
        bulkEnrollmentImportProgress: (state, action) => {
            state.bulkImport.processed = action.payload?.processed || 0;
            state.bulkImport.created = action.payload?.created || 0;
            state.bulkImport.skipped = action.payload?.skipped || 0;
            state.bulkImport.currentChunk = action.payload?.currentChunk || 0;
            state.bulkImport.failures = [...(action.payload?.failures || [])];

            if (action.payload?.enrollment?._id) {
                const alreadyExists = state.Enrollment.some(
                    (enrollment) => enrollment?._id === action.payload.enrollment._id,
                );

                if (!alreadyExists) {
                    state.Enrollment.push(action.payload.enrollment);
                }
            }
        },
        bulkEnrollmentImportCompleted: (state, action) => {
            state.bulkImport.status = "completed";
            state.bulkImport.processed = action.payload?.processed || 0;
            state.bulkImport.created = action.payload?.created || 0;
            state.bulkImport.skipped = action.payload?.skipped || 0;
            state.bulkImport.currentChunk = state.bulkImport.totalChunks;
            state.bulkImport.failures = [...(action.payload?.failures || [])];
            state.bulkImport.finishedAt = action.payload?.finishedAt || null;
            state.bulkImport.error = null;
        },
        bulkEnrollmentImportFailed: (state, action) => {
            state.bulkImport.status = "failed";
            state.bulkImport.error = action.payload?.error || "Bulk enrolment import failed.";
            state.bulkImport.processed = action.payload?.processed ?? state.bulkImport.processed;
            state.bulkImport.created = action.payload?.created ?? state.bulkImport.created;
            state.bulkImport.skipped = action.payload?.skipped ?? state.bulkImport.skipped;
            state.bulkImport.currentChunk =
                action.payload?.currentChunk ?? state.bulkImport.currentChunk;
            state.bulkImport.failures = [
                ...(action.payload?.failures || state.bulkImport.failures),
            ];
            state.bulkImport.finishedAt = action.payload?.finishedAt || null;
        },
        clearBulkEnrollmentImport: (state) => {
            state.bulkImport = createBulkImportState();
        },
    },
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchEnrollment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnrollment.fulfilled, (state, action) => {
                state.loading = false;
                state.Enrollment = action.payload;
            })
            .addCase(fetchEnrollment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // CREATE
            .addCase(createEnrollment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEnrollment.fulfilled, (state, action) => {
                state.loading = false;
                state.Enrollment.push(action.payload);
            })
            .addCase(createEnrollment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // UPDATE
            .addCase(updateEnrollment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEnrollment.fulfilled, (state, action) => {
                state.loading = false;
                // Match by _id if MongoDB, otherwise use id
                const updatedEnrollment = action.payload;
                const index = state.Enrollment.findIndex(c => c._id === updatedEnrollment._id);
                if (index !== -1) {
                    state.Enrollment[index] = updatedEnrollment;
                } else {
                    // Optional: push if not found
                    state.Enrollment.push(updatedEnrollment);
                }
            })
            .addCase(updateEnrollment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // DELETE
            .addCase(deleteEnrollment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEnrollment.fulfilled, (state, action) => {
                state.loading = false;
                state.Enrollment = state.Enrollment.filter(c => c._id !== action.payload);
            })
            .addCase(deleteEnrollment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // BULK IMPORT
            .addCase(importEnrollmentInChunks.pending, (state) => {
                state.error = null;
            })
            .addCase(importEnrollmentInChunks.fulfilled, (state) => {
                state.error = null;
            })
            .addCase(importEnrollmentInChunks.rejected, (state, action) => {
                state.error = action.payload?.error || "Bulk enrolment import failed";
            });
    },
});

export const {
    bulkEnrollmentImportStarted,
    bulkEnrollmentImportProgress,
    bulkEnrollmentImportCompleted,
    bulkEnrollmentImportFailed,
    clearBulkEnrollmentImport,
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;
