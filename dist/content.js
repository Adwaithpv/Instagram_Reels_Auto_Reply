/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@google/generative-ai/dist/index.mjs":
/*!***********************************************************!*\
  !*** ./node_modules/@google/generative-ai/dist/index.mjs ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BlockReason: () => (/* binding */ BlockReason),
/* harmony export */   ChatSession: () => (/* binding */ ChatSession),
/* harmony export */   FinishReason: () => (/* binding */ FinishReason),
/* harmony export */   GenerativeModel: () => (/* binding */ GenerativeModel),
/* harmony export */   GoogleGenerativeAI: () => (/* binding */ GoogleGenerativeAI),
/* harmony export */   HarmBlockThreshold: () => (/* binding */ HarmBlockThreshold),
/* harmony export */   HarmCategory: () => (/* binding */ HarmCategory),
/* harmony export */   HarmProbability: () => (/* binding */ HarmProbability),
/* harmony export */   TaskType: () => (/* binding */ TaskType)
/* harmony export */ });
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Harm categories that would cause prompts or candidates to be blocked.
 * @public
 */
var HarmCategory;
(function (HarmCategory) {
    HarmCategory["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
    HarmCategory["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
    HarmCategory["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
    HarmCategory["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
    HarmCategory["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
})(HarmCategory || (HarmCategory = {}));
/**
 * Threshold above which a prompt or candidate will be blocked.
 * @public
 */
var HarmBlockThreshold;
(function (HarmBlockThreshold) {
    // Threshold is unspecified.
    HarmBlockThreshold["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
    // Content with NEGLIGIBLE will be allowed.
    HarmBlockThreshold["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
    // Content with NEGLIGIBLE and LOW will be allowed.
    HarmBlockThreshold["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
    // Content with NEGLIGIBLE, LOW, and MEDIUM will be allowed.
    HarmBlockThreshold["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
    // All content will be allowed.
    HarmBlockThreshold["BLOCK_NONE"] = "BLOCK_NONE";
})(HarmBlockThreshold || (HarmBlockThreshold = {}));
/**
 * Probability that a prompt or candidate matches a harm category.
 * @public
 */
var HarmProbability;
(function (HarmProbability) {
    // Probability is unspecified.
    HarmProbability["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
    // Content has a negligible chance of being unsafe.
    HarmProbability["NEGLIGIBLE"] = "NEGLIGIBLE";
    // Content has a low chance of being unsafe.
    HarmProbability["LOW"] = "LOW";
    // Content has a medium chance of being unsafe.
    HarmProbability["MEDIUM"] = "MEDIUM";
    // Content has a high chance of being unsafe.
    HarmProbability["HIGH"] = "HIGH";
})(HarmProbability || (HarmProbability = {}));
/**
 * Reason that a prompt was blocked.
 * @public
 */
var BlockReason;
(function (BlockReason) {
    // A blocked reason was not specified.
    BlockReason["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
    // Content was blocked by safety settings.
    BlockReason["SAFETY"] = "SAFETY";
    // Content was blocked, but the reason is uncategorized.
    BlockReason["OTHER"] = "OTHER";
})(BlockReason || (BlockReason = {}));
/**
 * Reason that a candidate finished.
 * @public
 */
var FinishReason;
(function (FinishReason) {
    // Default value. This value is unused.
    FinishReason["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
    // Natural stop point of the model or provided stop sequence.
    FinishReason["STOP"] = "STOP";
    // The maximum number of tokens as specified in the request was reached.
    FinishReason["MAX_TOKENS"] = "MAX_TOKENS";
    // The candidate content was flagged for safety reasons.
    FinishReason["SAFETY"] = "SAFETY";
    // The candidate content was flagged for recitation reasons.
    FinishReason["RECITATION"] = "RECITATION";
    // Unknown reason.
    FinishReason["OTHER"] = "OTHER";
})(FinishReason || (FinishReason = {}));
/**
 * Task type for embedding content.
 * @public
 */
var TaskType;
(function (TaskType) {
    TaskType["TASK_TYPE_UNSPECIFIED"] = "TASK_TYPE_UNSPECIFIED";
    TaskType["RETRIEVAL_QUERY"] = "RETRIEVAL_QUERY";
    TaskType["RETRIEVAL_DOCUMENT"] = "RETRIEVAL_DOCUMENT";
    TaskType["SEMANTIC_SIMILARITY"] = "SEMANTIC_SIMILARITY";
    TaskType["CLASSIFICATION"] = "CLASSIFICATION";
    TaskType["CLUSTERING"] = "CLUSTERING";
})(TaskType || (TaskType = {}));

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class GoogleGenerativeAIError extends Error {
    constructor(message) {
        super(`[GoogleGenerativeAI Error]: ${message}`);
    }
}
class GoogleGenerativeAIResponseError extends GoogleGenerativeAIError {
    constructor(message, response) {
        super(message);
        this.response = response;
    }
}

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const BASE_URL = "https://generativelanguage.googleapis.com";
const API_VERSION = "v1";
/**
 * We can't `require` package.json if this runs on web. We will use rollup to
 * swap in the version number here at build time.
 */
const PACKAGE_VERSION = "0.2.1";
const PACKAGE_LOG_HEADER = "genai-js";
var Task;
(function (Task) {
    Task["GENERATE_CONTENT"] = "generateContent";
    Task["STREAM_GENERATE_CONTENT"] = "streamGenerateContent";
    Task["COUNT_TOKENS"] = "countTokens";
    Task["EMBED_CONTENT"] = "embedContent";
    Task["BATCH_EMBED_CONTENTS"] = "batchEmbedContents";
})(Task || (Task = {}));
class RequestUrl {
    constructor(model, task, apiKey, stream) {
        this.model = model;
        this.task = task;
        this.apiKey = apiKey;
        this.stream = stream;
    }
    toString() {
        let url = `${BASE_URL}/${API_VERSION}/${this.model}:${this.task}`;
        if (this.stream) {
            url += "?alt=sse";
        }
        return url;
    }
}
/**
 * Simple, but may become more complex if we add more versions to log.
 */
function getClientHeaders() {
    return `${PACKAGE_LOG_HEADER}/${PACKAGE_VERSION}`;
}
async function makeRequest(url, body, requestOptions) {
    let response;
    try {
        response = await fetch(url.toString(), Object.assign(Object.assign({}, buildFetchOptions(requestOptions)), { method: "POST", headers: {
                "Content-Type": "application/json",
                "x-goog-api-client": getClientHeaders(),
                "x-goog-api-key": url.apiKey,
            }, body }));
        if (!response.ok) {
            let message = "";
            try {
                const json = await response.json();
                message = json.error.message;
                if (json.error.details) {
                    message += ` ${JSON.stringify(json.error.details)}`;
                }
            }
            catch (e) {
                // ignored
            }
            throw new Error(`[${response.status} ${response.statusText}] ${message}`);
        }
    }
    catch (e) {
        const err = new GoogleGenerativeAIError(`Error fetching from ${url.toString()}: ${e.message}`);
        err.stack = e.stack;
        throw err;
    }
    return response;
}
/**
 * Generates the request options to be passed to the fetch API.
 * @param requestOptions - The user-defined request options.
 * @returns The generated request options.
 */
function buildFetchOptions(requestOptions) {
    const fetchOptions = {};
    if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
        const abortController = new AbortController();
        const signal = abortController.signal;
        setTimeout(() => abortController.abort(), requestOptions.timeout);
        fetchOptions.signal = signal;
    }
    return fetchOptions;
}

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Adds convenience helper methods to a response object, including stream
 * chunks (as long as each chunk is a complete GenerateContentResponse JSON).
 */
function addHelpers(response) {
    response.text = () => {
        if (response.candidates && response.candidates.length > 0) {
            if (response.candidates.length > 1) {
                console.warn(`This response had ${response.candidates.length} ` +
                    `candidates. Returning text from the first candidate only. ` +
                    `Access response.candidates directly to use the other candidates.`);
            }
            if (hadBadFinishReason(response.candidates[0])) {
                throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
            }
            return getText(response);
        }
        else if (response.promptFeedback) {
            throw new GoogleGenerativeAIResponseError(`Text not available. ${formatBlockErrorMessage(response)}`, response);
        }
        return "";
    };
    return response;
}
/**
 * Returns text of first candidate.
 */
function getText(response) {
    var _a, _b, _c, _d;
    if ((_d = (_c = (_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text) {
        return response.candidates[0].content.parts[0].text;
    }
    else {
        return "";
    }
}
const badFinishReasons = [FinishReason.RECITATION, FinishReason.SAFETY];
function hadBadFinishReason(candidate) {
    return (!!candidate.finishReason &&
        badFinishReasons.includes(candidate.finishReason));
}
function formatBlockErrorMessage(response) {
    var _a, _b, _c;
    let message = "";
    if ((!response.candidates || response.candidates.length === 0) &&
        response.promptFeedback) {
        message += "Response was blocked";
        if ((_a = response.promptFeedback) === null || _a === void 0 ? void 0 : _a.blockReason) {
            message += ` due to ${response.promptFeedback.blockReason}`;
        }
        if ((_b = response.promptFeedback) === null || _b === void 0 ? void 0 : _b.blockReasonMessage) {
            message += `: ${response.promptFeedback.blockReasonMessage}`;
        }
    }
    else if ((_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0]) {
        const firstCandidate = response.candidates[0];
        if (hadBadFinishReason(firstCandidate)) {
            message += `Candidate was blocked due to ${firstCandidate.finishReason}`;
            if (firstCandidate.finishMessage) {
                message += `: ${firstCandidate.finishMessage}`;
            }
        }
    }
    return message;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const responseLineRE = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
/**
 * Process a response.body stream from the backend and return an
 * iterator that provides one complete GenerateContentResponse at a time
 * and a promise that resolves with a single aggregated
 * GenerateContentResponse.
 *
 * @param response - Response from a fetch call
 */
function processStream(response) {
    const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", { fatal: true }));
    const responseStream = getResponseStream(inputStream);
    const [stream1, stream2] = responseStream.tee();
    return {
        stream: generateResponseSequence(stream1),
        response: getResponsePromise(stream2),
    };
}
async function getResponsePromise(stream) {
    const allResponses = [];
    const reader = stream.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            return addHelpers(aggregateResponses(allResponses));
        }
        allResponses.push(value);
    }
}
function generateResponseSequence(stream) {
    return __asyncGenerator(this, arguments, function* generateResponseSequence_1() {
        const reader = stream.getReader();
        while (true) {
            const { value, done } = yield __await(reader.read());
            if (done) {
                break;
            }
            yield yield __await(addHelpers(value));
        }
    });
}
/**
 * Reads a raw stream from the fetch response and join incomplete
 * chunks, returning a new stream that provides a single complete
 * GenerateContentResponse in each iteration.
 */
function getResponseStream(inputStream) {
    const reader = inputStream.getReader();
    const stream = new ReadableStream({
        start(controller) {
            let currentText = "";
            return pump();
            function pump() {
                return reader.read().then(({ value, done }) => {
                    if (done) {
                        if (currentText.trim()) {
                            controller.error(new GoogleGenerativeAIError("Failed to parse stream"));
                            return;
                        }
                        controller.close();
                        return;
                    }
                    currentText += value;
                    let match = currentText.match(responseLineRE);
                    let parsedResponse;
                    while (match) {
                        try {
                            parsedResponse = JSON.parse(match[1]);
                        }
                        catch (e) {
                            controller.error(new GoogleGenerativeAIError(`Error parsing JSON response: "${match[1]}"`));
                            return;
                        }
                        controller.enqueue(parsedResponse);
                        currentText = currentText.substring(match[0].length);
                        match = currentText.match(responseLineRE);
                    }
                    return pump();
                });
            }
        },
    });
    return stream;
}
/**
 * Aggregates an array of `GenerateContentResponse`s into a single
 * GenerateContentResponse.
 */
function aggregateResponses(responses) {
    const lastResponse = responses[responses.length - 1];
    const aggregatedResponse = {
        promptFeedback: lastResponse === null || lastResponse === void 0 ? void 0 : lastResponse.promptFeedback,
    };
    for (const response of responses) {
        if (response.candidates) {
            for (const candidate of response.candidates) {
                const i = candidate.index;
                if (!aggregatedResponse.candidates) {
                    aggregatedResponse.candidates = [];
                }
                if (!aggregatedResponse.candidates[i]) {
                    aggregatedResponse.candidates[i] = {
                        index: candidate.index,
                    };
                }
                // Keep overwriting, the last one will be final
                aggregatedResponse.candidates[i].citationMetadata =
                    candidate.citationMetadata;
                aggregatedResponse.candidates[i].finishReason = candidate.finishReason;
                aggregatedResponse.candidates[i].finishMessage =
                    candidate.finishMessage;
                aggregatedResponse.candidates[i].safetyRatings =
                    candidate.safetyRatings;
                /**
                 * Candidates should always have content and parts, but this handles
                 * possible malformed responses.
                 */
                if (candidate.content && candidate.content.parts) {
                    if (!aggregatedResponse.candidates[i].content) {
                        aggregatedResponse.candidates[i].content = {
                            role: candidate.content.role || "user",
                            parts: [{ text: "" }],
                        };
                    }
                    for (const part of candidate.content.parts) {
                        if (part.text) {
                            aggregatedResponse.candidates[i].content.parts[0].text +=
                                part.text;
                        }
                    }
                }
            }
        }
    }
    return aggregatedResponse;
}

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function generateContentStream(apiKey, model, params, requestOptions) {
    const url = new RequestUrl(model, Task.STREAM_GENERATE_CONTENT, apiKey, 
    /* stream */ true);
    const response = await makeRequest(url, JSON.stringify(params), requestOptions);
    return processStream(response);
}
async function generateContent(apiKey, model, params, requestOptions) {
    const url = new RequestUrl(model, Task.GENERATE_CONTENT, apiKey, 
    /* stream */ false);
    const response = await makeRequest(url, JSON.stringify(params), requestOptions);
    const responseJson = await response.json();
    const enhancedResponse = addHelpers(responseJson);
    return {
        response: enhancedResponse,
    };
}

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function formatNewContent(request, role) {
    let newParts = [];
    if (typeof request === "string") {
        newParts = [{ text: request }];
    }
    else {
        for (const partOrString of request) {
            if (typeof partOrString === "string") {
                newParts.push({ text: partOrString });
            }
            else {
                newParts.push(partOrString);
            }
        }
    }
    return { role, parts: newParts };
}
function formatGenerateContentInput(params) {
    if (params.contents) {
        return params;
    }
    else {
        const content = formatNewContent(params, "user");
        return { contents: [content] };
    }
}
function formatEmbedContentInput(params) {
    if (typeof params === "string" || Array.isArray(params)) {
        const content = formatNewContent(params, "user");
        return { content };
    }
    return params;
}

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Do not log a message for this error.
 */
const SILENT_ERROR = "SILENT_ERROR";
/**
 * ChatSession class that enables sending chat messages and stores
 * history of sent and received messages so far.
 *
 * @public
 */
class ChatSession {
    constructor(apiKey, model, params, requestOptions) {
        this.model = model;
        this.params = params;
        this.requestOptions = requestOptions;
        this._history = [];
        this._sendPromise = Promise.resolve();
        this._apiKey = apiKey;
        if (params === null || params === void 0 ? void 0 : params.history) {
            this._history = params.history.map((content) => {
                if (!content.role) {
                    throw new Error("Missing role for history item: " + JSON.stringify(content));
                }
                return formatNewContent(content.parts, content.role);
            });
        }
    }
    /**
     * Gets the chat history so far. Blocked prompts are not added to history.
     * Blocked candidates are not added to history, nor are the prompts that
     * generated them.
     */
    async getHistory() {
        await this._sendPromise;
        return this._history;
    }
    /**
     * Sends a chat message and receives a non-streaming
     * {@link GenerateContentResult}
     */
    async sendMessage(request) {
        var _a, _b;
        await this._sendPromise;
        const newContent = formatNewContent(request, "user");
        const generateContentRequest = {
            safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
            generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
            contents: [...this._history, newContent],
        };
        let finalResult;
        // Add onto the chain.
        this._sendPromise = this._sendPromise
            .then(() => generateContent(this._apiKey, this.model, generateContentRequest, this.requestOptions))
            .then((result) => {
            var _a;
            if (result.response.candidates &&
                result.response.candidates.length > 0) {
                this._history.push(newContent);
                const responseContent = Object.assign({ parts: [], 
                    // Response seems to come back without a role set.
                    role: "model" }, (_a = result.response.candidates) === null || _a === void 0 ? void 0 : _a[0].content);
                this._history.push(responseContent);
            }
            else {
                const blockErrorMessage = formatBlockErrorMessage(result.response);
                if (blockErrorMessage) {
                    console.warn(`sendMessage() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
                }
            }
            finalResult = result;
        });
        await this._sendPromise;
        return finalResult;
    }
    /**
     * Sends a chat message and receives the response as a
     * {@link GenerateContentStreamResult} containing an iterable stream
     * and a response promise.
     */
    async sendMessageStream(request) {
        var _a, _b;
        await this._sendPromise;
        const newContent = formatNewContent(request, "user");
        const generateContentRequest = {
            safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
            generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
            contents: [...this._history, newContent],
        };
        const streamPromise = generateContentStream(this._apiKey, this.model, generateContentRequest, this.requestOptions);
        // Add onto the chain.
        this._sendPromise = this._sendPromise
            .then(() => streamPromise)
            // This must be handled to avoid unhandled rejection, but jump
            // to the final catch block with a label to not log this error.
            .catch((_ignored) => {
            throw new Error(SILENT_ERROR);
        })
            .then((streamResult) => streamResult.response)
            .then((response) => {
            if (response.candidates && response.candidates.length > 0) {
                this._history.push(newContent);
                const responseContent = Object.assign({}, response.candidates[0].content);
                // Response seems to come back without a role set.
                if (!responseContent.role) {
                    responseContent.role = "model";
                }
                this._history.push(responseContent);
            }
            else {
                const blockErrorMessage = formatBlockErrorMessage(response);
                if (blockErrorMessage) {
                    console.warn(`sendMessageStream() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
                }
            }
        })
            .catch((e) => {
            // Errors in streamPromise are already catchable by the user as
            // streamPromise is returned.
            // Avoid duplicating the error message in logs.
            if (e.message !== SILENT_ERROR) {
                // Users do not have access to _sendPromise to catch errors
                // downstream from streamPromise, so they should not throw.
                console.error(e);
            }
        });
        return streamPromise;
    }
}

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function countTokens(apiKey, model, params, requestOptions) {
    const url = new RequestUrl(model, Task.COUNT_TOKENS, apiKey, false);
    const response = await makeRequest(url, JSON.stringify(Object.assign(Object.assign({}, params), { model })), requestOptions);
    return response.json();
}

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function embedContent(apiKey, model, params, requestOptions) {
    const url = new RequestUrl(model, Task.EMBED_CONTENT, apiKey, false);
    const response = await makeRequest(url, JSON.stringify(params), requestOptions);
    return response.json();
}
async function batchEmbedContents(apiKey, model, params, requestOptions) {
    const url = new RequestUrl(model, Task.BATCH_EMBED_CONTENTS, apiKey, false);
    const requestsWithModel = params.requests.map((request) => {
        return Object.assign(Object.assign({}, request), { model });
    });
    const response = await makeRequest(url, JSON.stringify({ requests: requestsWithModel }), requestOptions);
    return response.json();
}

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Class for generative model APIs.
 * @public
 */
class GenerativeModel {
    constructor(apiKey, modelParams, requestOptions) {
        this.apiKey = apiKey;
        if (modelParams.model.includes("/")) {
            // Models may be named "models/model-name" or "tunedModels/model-name"
            this.model = modelParams.model;
        }
        else {
            // If path is not included, assume it's a non-tuned model.
            this.model = `models/${modelParams.model}`;
        }
        this.generationConfig = modelParams.generationConfig || {};
        this.safetySettings = modelParams.safetySettings || [];
        this.requestOptions = requestOptions || {};
    }
    /**
     * Makes a single non-streaming call to the model
     * and returns an object containing a single {@link GenerateContentResponse}.
     */
    async generateContent(request) {
        const formattedParams = formatGenerateContentInput(request);
        return generateContent(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings }, formattedParams), this.requestOptions);
    }
    /**
     * Makes a single streaming call to the model
     * and returns an object containing an iterable stream that iterates
     * over all chunks in the streaming response as well as
     * a promise that returns the final aggregated response.
     */
    async generateContentStream(request) {
        const formattedParams = formatGenerateContentInput(request);
        return generateContentStream(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings }, formattedParams), this.requestOptions);
    }
    /**
     * Gets a new {@link ChatSession} instance which can be used for
     * multi-turn chats.
     */
    startChat(startChatParams) {
        return new ChatSession(this.apiKey, this.model, startChatParams, this.requestOptions);
    }
    /**
     * Counts the tokens in the provided request.
     */
    async countTokens(request) {
        const formattedParams = formatGenerateContentInput(request);
        return countTokens(this.apiKey, this.model, formattedParams);
    }
    /**
     * Embeds the provided content.
     */
    async embedContent(request) {
        const formattedParams = formatEmbedContentInput(request);
        return embedContent(this.apiKey, this.model, formattedParams);
    }
    /**
     * Embeds an array of {@link EmbedContentRequest}s.
     */
    async batchEmbedContents(batchEmbedContentRequest) {
        return batchEmbedContents(this.apiKey, this.model, batchEmbedContentRequest, this.requestOptions);
    }
}

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Top-level class for this SDK
 * @public
 */
class GoogleGenerativeAI {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    /**
     * Gets a {@link GenerativeModel} instance for the provided model name.
     */
    getGenerativeModel(modelParams, requestOptions) {
        if (!modelParams.model) {
            throw new GoogleGenerativeAIError(`Must provide a model name. ` +
                `Example: genai.getGenerativeModel({ model: 'my-model-name' })`);
        }
        return new GenerativeModel(this.apiKey, modelParams, requestOptions);
    }
}


//# sourceMappingURL=index.mjs.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/content/index.ts ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _google_generative_ai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @google/generative-ai */ "./node_modules/@google/generative-ai/dist/index.mjs");

let genAI = null;
let observer = null;
let isProcessing = false;
let retryCount = 0;
let isExtensionConnected = true;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const SECURITY_DELAY = 2000; // 2 seconds for security-related delays
let processedReels = new Set();
let lastProcessedReelId = null;
let lastReelCount = 0;
// Debug logging function
function debugLog(message, data) {
    console.log(`[Instagram Reels Auto-Reply] ${message}`, data || '');
}
// Set up connection to detect extension unload/reload
function setupConnectionMonitor() {
    try {
        debugLog('Setting up connection monitor');
        const port = chrome.runtime.connect({ name: 'instagram-reels-content-script' });
        if (chrome.runtime.lastError) {
            debugLog('Connection warning:', chrome.runtime.lastError.message);
        }
        port.onDisconnect.addListener(() => {
            if (chrome.runtime.lastError) {
                debugLog('Disconnect warning:', chrome.runtime.lastError.message);
            }
            debugLog('Extension disconnected - disabling content script');
            isExtensionConnected = false;
            cleanup();
        });
        isExtensionConnected = true;
        debugLog('Connection monitor setup successful');
        return true;
    }
    catch (error) {
        debugLog('Failed to connect to extension:', error);
        isExtensionConnected = false;
        return false;
    }
}
// Fallback method to check extension connection
function checkExtensionConnection() {
    try {
        if (chrome && chrome.runtime && chrome.runtime.id) {
            return true;
        }
        debugLog('Extension connection check failed - no runtime ID');
        return false;
    }
    catch (error) {
        debugLog('Extension connection check failed:', error);
        return false;
    }
}
// Cleanup function to stop all activities when disconnected
function cleanup() {
    debugLog('Cleaning up content script');
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    genAI = null;
    isProcessing = false;
    retryCount = 0;
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('pageshow', handlePageShow);
}
// Initialize Gemini API
async function initGemini(apiKey) {
    if (!checkExtensionConnection()) {
        debugLog('Cannot initialize Gemini - extension not connected');
        return null;
    }
    try {
        debugLog('Initializing Gemini API with key:', apiKey.substring(0, 10) + '...');
        genAI = new _google_generative_ai__WEBPACK_IMPORTED_MODULE_0__.GoogleGenerativeAI(apiKey);
        // Test the API with a simple request
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        await model.generateContent("Test");
        debugLog('Gemini API initialized and tested successfully');
        return genAI;
    }
    catch (error) {
        debugLog('Failed to initialize Gemini API:', error);
        return null;
    }
}
// Safe DOM query function with security checks
function safeQuerySelector(selector) {
    if (!checkExtensionConnection()) {
        debugLog('Cannot query DOM - extension not connected');
        return null;
    }
    try {
        const element = document.querySelector(selector);
        if (!element) {
            debugLog(`Element not found: ${selector}`);
        }
        return element;
    }
    catch (error) {
        debugLog('DOM query failed:', error);
        return null;
    }
}
// Wait for Instagram's chat input to be ready with security checks
async function waitForChatInput() {
    if (!checkExtensionConnection()) {
        debugLog('Cannot wait for chat input - extension not connected');
        return null;
    }
    debugLog('Waiting for chat input');
    return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 10;
        const interval = setInterval(() => {
            if (!checkExtensionConnection()) {
                clearInterval(interval);
                debugLog('Connection lost while waiting for chat input');
                resolve(null);
                return;
            }
            try {
                const chatInput = safeQuerySelector('div[role="textbox"]');
                if (chatInput) {
                    clearInterval(interval);
                    debugLog('Chat input found');
                    resolve(chatInput);
                }
                else if (++attempts >= maxAttempts) {
                    clearInterval(interval);
                    debugLog('Chat input not found after maximum attempts');
                    resolve(null);
                }
            }
            catch (error) {
                debugLog('Error checking for chat input:', error);
                if (++attempts >= maxAttempts) {
                    clearInterval(interval);
                    resolve(null);
                }
            }
        }, 500);
    });
}
// Send message to chat with enhanced security checks
async function sendMessage(message) {
    if (!checkExtensionConnection()) {
        debugLog('Cannot send message - extension not connected');
        return false;
    }
    debugLog('Attempting to send message:', message);
    try {
        const chatInput = await waitForChatInput();
        if (!chatInput) {
            debugLog('Cannot send message - chat input not found');
            return false;
        }
        debugLog('Focusing chat input');
        await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
        try {
            chatInput.focus();
            const event = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: message
            });
            chatInput.dispatchEvent(event);
            debugLog('Message typed into chat input');
        }
        catch (error) {
            debugLog('Error interacting with chat input:', error);
            return false;
        }
        await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
        try {
            // Look for the send button with the exact class structure
            const sendButtons = document.querySelectorAll('div[role="button"][tabindex="0"]');
            const sendButton = Array.from(sendButtons).find(button => button.textContent?.trim() === 'Send');
            if (!sendButton) {
                debugLog('Cannot send message - send button not found');
                return false;
            }
            debugLog('Found send button, clicking it');
            sendButton.click();
            debugLog('Message sent successfully');
            return true;
        }
        catch (error) {
            debugLog('Error clicking send button:', error);
            return false;
        }
    }
    catch (error) {
        debugLog('Unexpected error in sendMessage:', error);
        return false;
    }
}
// Function to safely get image data
async function getImageData(imgElement) {
    return new Promise((resolve) => {
        try {
            // Create a canvas with the same dimensions as the image
            const canvas = document.createElement('canvas');
            canvas.width = imgElement.naturalWidth;
            canvas.height = imgElement.naturalHeight;
            // Get the canvas context
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                debugLog('Could not get canvas context');
                resolve(null);
                return;
            }
            // Try to draw the image
            try {
                ctx.drawImage(imgElement, 0, 0);
                // Get the image data as a blob
                canvas.toBlob((blob) => {
                    if (!blob) {
                        debugLog('Failed to create blob from canvas');
                        resolve(null);
                        return;
                    }
                    // Create a FileReader to read the blob
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64 = reader.result;
                        resolve(base64);
                    };
                    reader.onerror = () => {
                        debugLog('Failed to read blob');
                        resolve(null);
                    };
                    reader.readAsDataURL(blob);
                }, 'image/jpeg');
            }
            catch (error) {
                debugLog('Failed to draw image to canvas:', error);
                resolve(null);
            }
        }
        catch (error) {
            debugLog('Error in getImageData:', error);
            resolve(null);
        }
    });
}
// Function to capture a frame from a video element
async function captureVideoFrame(video) {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            debugLog('Could not get canvas context');
            return null;
        }
        // Draw the current frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Convert to base64
        return canvas.toDataURL('image/jpeg', 0.8);
    }
    catch (error) {
        debugLog('Error capturing video frame:', error);
        return null;
    }
}
// Function to play reel and capture frames
async function playAndCaptureReel(container) {
    try {
        // Click the reel to start playback
        const reelClickArea = container.querySelector('[id^="mid\\."] > div.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x78zum5.xh8yej3 > div.x1cy8zhl.x78zum5.xdt5ytf.x193iq5w.x1n2onr6.x1kxipp6 > div > div > div > div > div > div > div.x1ey2m1c.xds687c.x17qophe.x10l6tqk.x13vifvy.x6m44yg');
        if (!reelClickArea) {
            debugLog('Could not find reel click area');
            return [];
        }
        debugLog('Clicking reel to start playback');
        reelClickArea.click();
        // Wait for the video player to appear
        await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
        // Find the video element
        const videoContainer = document.querySelector('body > div.x1n2onr6.xzkaem6 > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe.x1qjc9v5.xjbqb8w.x1lcm9me.x1yr5g0i.xrt01vj.x10y3i5r.xr1yuqi.xkrivgy.x4ii5y1.x1gryazu.x15h9jz8.x47corl.xh8yej3.xir0mxb.x1juhsu6 > div > article > div > div._aatk._aatl');
        const video = videoContainer?.querySelector('video');
        if (!video) {
            debugLog('Could not find video element');
            return [];
        }
        debugLog('Found video element, waiting for playback');
        // Wait for video to start playing
        await new Promise((resolve) => {
            const checkVideo = () => {
                if (!video.paused && video.currentTime > 0) {
                    resolve();
                }
                else {
                    setTimeout(checkVideo, 100);
                }
            };
            checkVideo();
        });
        debugLog('Video is playing, capturing frames');
        // Capture frames at different points in the video
        const frames = [];
        const capturePoints = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9]; // Capture at 15%, 30%, 45%, 60%, 75%, and 90% of the video
        for (const point of capturePoints) {
            // Seek to the desired point
            video.currentTime = video.duration * point;
            // Wait for seek to complete
            await new Promise((resolve) => {
                video.onseeked = () => resolve();
            });
            // Capture frame
            const frame = await captureVideoFrame(video);
            if (frame) {
                frames.push(frame);
                debugLog(`Captured frame at ${Math.round(point * 100)}% of video`);
            }
        }
        // Find and click the close button
        const closeButton = document.querySelector('div.x6s0dn4.x78zum5.xdt5ytf.xl56j7k svg[aria-label="Close"]')?.closest('div[role="button"]');
        if (closeButton) {
            debugLog('Found close button, clicking it');
            closeButton.click();
            await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
        }
        else {
            debugLog('Could not find close button, clicking outside instead');
            document.body.click();
        }
        return frames;
    }
    catch (error) {
        debugLog('Error in playAndCaptureReel:', error);
        return [];
    }
}
// Process reels with enhanced security checks
async function processReels(containers) {
    if (!checkExtensionConnection() || isProcessing) {
        debugLog('Cannot process reels - extension not connected or already processing');
        return;
    }
    debugLog('Starting to process reels');
    isProcessing = true;
    try {
        for (const container of Array.from(containers)) {
            if (!checkExtensionConnection()) {
                debugLog('Connection lost while processing reels');
                return;
            }
            try {
                // Check if this is a reel container by looking for the clip icon
                const clipIcon = container.querySelector('svg[aria-label="Clip"]');
                if (!clipIcon) {
                    debugLog('No clip icon found, not a reel');
                    continue;
                }
                // Get the username from the link
                const usernameLink = container.querySelector('a[href^="/"]');
                const username = usernameLink?.getAttribute('href')?.replace('/', '') || '';
                if (!username) {
                    debugLog('No username found, skipping');
                    continue;
                }
                // Get the media URL for a more stable identifier
                const mediaElement = container.querySelector('img[src*="cdninstagram.com"]') ||
                    container.querySelector('video');
                const mediaUrl = mediaElement?.getAttribute('src') || '';
                // Create a stable identifier using username and media URL
                const reelId = `${username}_${mediaUrl.split('/').pop()?.split('?')[0] || ''}`;
                if (processedReels.has(reelId)) {
                    debugLog('Reel already processed, skipping');
                    continue;
                }
                // Get all possible content from the reel
                const description = mediaElement?.getAttribute('alt') ||
                    mediaElement?.getAttribute('aria-label') ||
                    '';
                // Get any text content from the reel
                const textContent = Array.from(container.querySelectorAll('span, div'))
                    .map(el => el.textContent?.trim())
                    .filter(Boolean)
                    .join(' ');
                debugLog('Found reel from user:', username);
                debugLog('Reel media URL:', mediaUrl);
                debugLog('Reel description:', description);
                debugLog('Reel text content:', textContent);
                processedReels.add(reelId);
                debugLog(`Added reel ${reelId} to processed set`);
                if (!genAI) {
                    debugLog('Reinitializing Gemini API');
                    const apiKey = await new Promise((resolve) => {
                        chrome.storage.sync.get(['apiKey'], (result) => {
                            resolve(result.apiKey);
                        });
                    });
                    await initGemini(apiKey);
                }
                if (genAI) {
                    let success = false;
                    while (!success && retryCount < MAX_RETRIES && checkExtensionConnection()) {
                        try {
                            debugLog('Generating reply for reel');
                            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
                            // Capture frames from the reel
                            debugLog('Attempting to capture frames from reel');
                            const frames = await playAndCaptureReel(container);
                            // Create a detailed prompt with all available information
                            const prompt = `Generate a short, natural reply to an Instagram reel that someone sent me in DMs. The reel is about:
Content details:
- Description: ${description}
- Text content: ${textContent}
${frames.length > 0 ? '- I can see multiple frames from the video above\n' : ''}


Requirements:
- Be specific to the content (mention something specific you notice)
- Super brief (3-10 words max)
- No generic phrases like "Haha nice!" or "That's cool!"
- Do not be overly enthusiastic. Its not always that every reel is happy. Be chill.
- Sound casual like a real text (lowercase ok, abbreviations ok)
- Max 1 emoji if absolutely relevant, else do not use any emojis.
- Reply as if I just watched it
- Output should just be the reply, nothing else. Do not give any sensitive information. Do not give any reply options.`;
                            const result = await model.generateContent([
                                { text: prompt },
                                ...frames.map(frame => ({ inlineData: { mimeType: "image/jpeg", data: frame.split(',')[1] } }))
                            ]);
                            const response = await result.response;
                            const reply = response.text();
                            debugLog('Generated reply:', reply);
                            if (reply) {
                                // Find the hover area container
                                const hoverArea = container.querySelector('div[class*="x1eb86dx"][class*="x78zum5"]');
                                if (hoverArea) {
                                    debugLog('Found hover area, simulating hover');
                                    const mouseoverEvent = new MouseEvent('mouseover', {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window
                                    });
                                    hoverArea.dispatchEvent(mouseoverEvent);
                                    // Wait for the reply button to appear
                                    await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
                                    // Try to find and click the reply button using the exact selector path
                                    const replyButton = document.querySelector('#mount_0_0_pB > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x9f619.xvbhtw8.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1qughib > div.x1gryazu.xh8yej3.x10o80wk.x14k21rp.x1v4esvl.x8vgawa > section > main > section > div > div > div > div.xjp7ctv > div > div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x193iq5w.xeuugli.x1r8uery.x1iyjqo2.xs83m0k > div > div > div.x9f619.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1iyjqo2.x2lwn1j.xeuugli.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1.xcrg951.x6prxxf.x6ikm8r.x10wlt62.x1n2onr6.xh8yej3 > div > div.x78zum5.xdt5ytf.x1iyjqo2.x193iq5w.x2lwn1j.x1n2onr6 > div.x78zum5.x1r8uery.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62 > div > div > div > div > div > div > div:nth-child(3) > div > div:nth-child(8) > div > div > div > div > div:nth-child(1) > div > div > div.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x1eb86dx.x78zum5.x1c4vz4f.x2lah0s.x18061mc.xjz4gdx > div > div > div > div > div:nth-child(2) > span > div > div > div > svg')?.closest('div[role="button"]');
                                    if (replyButton) {
                                        debugLog('Found reply button using exact selector, clicking it');
                                        replyButton.click();
                                        await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
                                    }
                                    else {
                                        debugLog('Reply button not found using exact selector, trying alternative approach');
                                        // Try finding the button by looking for the SVG with aria-label="Reply"
                                        const replySvg = document.querySelector('svg[aria-label="Reply"]');
                                        if (replySvg) {
                                            const alternativeButton = replySvg.closest('div[role="button"]');
                                            if (alternativeButton) {
                                                debugLog('Found reply button using alternative selector, clicking it');
                                                alternativeButton.click();
                                                await new Promise(resolve => setTimeout(resolve, SECURITY_DELAY));
                                            }
                                            else {
                                                debugLog('Could not find parent button for reply SVG');
                                            }
                                        }
                                        else {
                                            debugLog('Could not find reply SVG');
                                        }
                                    }
                                }
                                else {
                                    debugLog('Hover area not found');
                                }
                                success = await sendMessage(reply);
                                if (!success) {
                                    retryCount++;
                                    debugLog(`Failed to send message, retry ${retryCount}/${MAX_RETRIES}`);
                                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
                                }
                            }
                        }
                        catch (error) {
                            debugLog('Error processing reel, retrying...', error);
                            retryCount++;
                            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
                        }
                    }
                    retryCount = 0;
                }
                else {
                    debugLog('Cannot process reel - Gemini API not initialized');
                }
            }
            catch (error) {
                debugLog('Error processing container:', error);
                continue;
            }
        }
    }
    catch (error) {
        debugLog('Unexpected error in processReels:', error);
    }
    finally {
        isProcessing = false;
        debugLog('Finished processing reels');
    }
}
// Detect reels with security checks
function detectReels() {
    if (!checkExtensionConnection() || isProcessing) {
        debugLog('Cannot detect reels - extension not connected or already processing');
        return;
    }
    debugLog('Detecting reels');
    try {
        // Look for containers that have the clip icon (indicating a reel)
        const reelContainers = document.querySelectorAll('div[role="button"]');
        const actualReels = Array.from(reelContainers).filter(container => container.querySelector('svg[aria-label="Clip"]'));
        const currentReelCount = actualReels.length;
        debugLog(`Found ${currentReelCount} reels (previous count: ${lastReelCount})`);
        // Check if we have any unprocessed reels
        const hasUnprocessedReels = actualReels.some(container => {
            const usernameLink = container.querySelector('a[href^="/"]');
            const username = usernameLink?.getAttribute('href')?.replace('/', '') || '';
            const mediaElement = container.querySelector('img[src*="cdninstagram.com"]') ||
                container.querySelector('video');
            const mediaUrl = mediaElement?.getAttribute('src') || '';
            const reelId = `${username}_${mediaUrl.split('/').pop()?.split('?')[0] || ''}`;
            return !processedReels.has(reelId);
        });
        // Process if we have more reels than before, or if we have unprocessed reels
        if (currentReelCount > lastReelCount || hasUnprocessedReels) {
            debugLog('New or unprocessed reels detected, processing...');
            lastReelCount = currentReelCount;
            processReels(actualReels);
        }
        else {
            debugLog('No new or unprocessed reels detected, skipping processing');
        }
    }
    catch (error) {
        debugLog('Error detecting reels:', error);
    }
}
// Handle visibility changes
function handleVisibilityChange() {
    debugLog('Visibility changed:', document.visibilityState);
    if (document.visibilityState === 'visible' && checkExtensionConnection()) {
        init();
    }
}
// Handle page show event
function handlePageShow(event) {
    debugLog('Page shown, persisted:', event.persisted);
    if (event.persisted && checkExtensionConnection()) {
        init();
    }
}
// Alternative initialization that doesn't rely on runtime.connect
function safeInit() {
    debugLog('Starting safe initialization');
    if (!checkExtensionConnection()) {
        debugLog('Cannot initialize - extension not connected');
        return;
    }
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    try {
        debugLog('Getting extension settings');
        chrome.storage.sync.get(['enabled', 'apiKey'], async (result) => {
            if (chrome.runtime.lastError) {
                debugLog('Storage API error:', chrome.runtime.lastError.message);
                return;
            }
            debugLog('Extension settings:', result);
            if (result.enabled && result.apiKey) {
                await initGemini(result.apiKey);
                if (!checkExtensionConnection()) {
                    debugLog('Connection lost after Gemini initialization');
                    return;
                }
                debugLog('Setting up mutation observer');
                let timeoutId = null;
                observer = new MutationObserver(() => {
                    if (!checkExtensionConnection()) {
                        if (timeoutId) {
                            window.clearTimeout(timeoutId);
                        }
                        observer?.disconnect();
                        return;
                    }
                    if (timeoutId) {
                        window.clearTimeout(timeoutId);
                    }
                    timeoutId = window.setTimeout(detectReels, SECURITY_DELAY);
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                debugLog('Mutation observer setup complete');
            }
            else {
                debugLog('Extension not enabled or API key not set');
            }
        });
    }
    catch (error) {
        debugLog('Error in safe initialization:', error);
        if (error.message && error.message.includes('Extension context invalidated')) {
            cleanup();
        }
        else {
            setTimeout(safeInit, RETRY_DELAY);
        }
    }
}
// Initialize with security checks
async function init() {
    debugLog('Starting initialization');
    try {
        const connected = setupConnectionMonitor();
        if (!connected) {
            debugLog('Connection monitor setup failed, falling back to safe init');
            safeInit();
            return;
        }
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        try {
            debugLog('Getting extension settings');
            const result = await chrome.storage.sync.get(['enabled', 'apiKey']);
            debugLog('Extension settings:', result);
            if (result.enabled && result.apiKey) {
                await initGemini(result.apiKey);
                debugLog('Setting up mutation observer');
                let timeoutId = null;
                observer = new MutationObserver(() => {
                    if (!checkExtensionConnection()) {
                        if (timeoutId) {
                            window.clearTimeout(timeoutId);
                        }
                        observer?.disconnect();
                        return;
                    }
                    if (timeoutId) {
                        window.clearTimeout(timeoutId);
                    }
                    timeoutId = window.setTimeout(detectReels, SECURITY_DELAY);
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                debugLog('Mutation observer setup complete');
            }
            else {
                debugLog('Extension not enabled or API key not set');
            }
        }
        catch (error) {
            debugLog('Error in initialization:', error);
            if (error.message && error.message.includes('Extension context invalidated')) {
                isExtensionConnected = false;
                cleanup();
            }
            else {
                setTimeout(safeInit, RETRY_DELAY);
            }
        }
    }
    catch (error) {
        debugLog('Fatal error during initialization:', error);
        safeInit();
    }
}
// Set up event listeners
debugLog('Setting up event listeners');
document.addEventListener('visibilitychange', handleVisibilityChange);
window.addEventListener('load', init);
window.addEventListener('pageshow', handlePageShow);
// Start the extension
debugLog('Instagram Reels Auto-Reply content script starting');
init();

})();

/******/ })()
;
//# sourceMappingURL=content.js.map