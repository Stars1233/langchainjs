import { getEnvironmentVariable } from "@langchain/core/utils/env";

const TAVILY_BASE_URL = "https://api.tavily.com";

/**
 * The parameters for the Tavily Search API.
 */
export type TavilySearchParamsBase = {
  /**
   * The query to search for.
   */
  query: string;
  /**
   * The topic of the search.
   *
   * @default "general"
   */
  topic?: "general" | "news" | "finance";
  /**
   * The depth of the search.
   *
   * @default "basic"
   */
  search_depth?: "basic" | "advanced";

  /**
   * The number of {@link TavilySearchResult.content} chunks to retrieve from each source.
   * Each chunk's length is maximum 500 characters. Available only when
   * {@link TavilySearchParams.search_depth} is advanced.
   *
   * @default 3
   */
  chunks_per_source?: number;
  /**
   * The maximum number of search results to return.
   *
   * @default 5
   */
  max_results?: number;
  /**
   * The time range of the search.
   */
  time_range?: "day" | "week" | "month" | "year";
  /**
   * Number of days back from the current date to include. Available only if topic is news.
   */
  days?: number;
  /**
   * Include an LLM-generated answer to the provided query. `"basic"` or `true` returns a quick
   * answer, while `"advanced"` returns a more detailed answer.
   *
   * @default false
   */
  include_answer?: boolean | "basic" | "advanced";
  /**
   * Whether to include the raw content of the search results.
   *
   * @default false
   */
  include_raw_content?: boolean;
  /**
   * A list of domains to specifically include in the search results.
   */
  include_domains?: string[];
  /**
   * A list of domains to specifically exclude from the search results.
   */
  exclude_domains?: string[];
} & Record<string, unknown>;

export type TavilySearchParamsWithSimpleImages = TavilySearchParamsBase & {
  /**
   * Also perform an image search and include the results in the response.
   *
   * @default false
   */
  include_images?: boolean;
  /**
   * When {@link TavilySearchParams.include_images} is true, also add a descriptive text for each
   * image.
   *
   * @default false
   */
  include_image_descriptions?: false;
};

export type TavilySearchParamsWithImageDescriptions = TavilySearchParamsBase & {
  /**
   * Also perform an image search and include the results in the response.
   */
  include_images?: true;
  /**
   * When {@link TavilySearchParams.include_images} is true, also add a descriptive text for each
   * image.
   */
  include_image_descriptions?: true;
};

export type TavilySearchParams =
  | TavilySearchParamsWithSimpleImages
  | TavilySearchParamsWithImageDescriptions;

/**
 * The parameters for the Tavily Extract API.
 */
export type TavilyExtractParams = {
  /**
   * The URL or list of URLs to extract content from.
   *
   * Example: "https://en.wikipedia.org/wiki/Artificial_intelligence" or
   * ["https://en.wikipedia.org/wiki/Artificial_intelligence", ...]
   */
  urls: string | string[];
  /**
   * Include a list of images extracted from the URLs in the response.
   *
   * @default false
   */
  include_images?: boolean;
  /**
   * The depth of the extraction process. `"advanced"` extraction retrieves more data, including
   * tables and embedded content, with higher success but may increase latency. The cost for
   * `"advanced"` extraction requests may be higher than `"basic"` extraction.
   *
   * @default "basic"
   */
  extract_depth?: "basic" | "advanced";
} & Record<string, unknown>;

/**
 * A single extraction result from the Tavily Extract API.
 */
export type TavilyExtractResult = {
  /**
   * The URL from which the content was extracted.
   */
  url: string;
  /**
   * The full content extracted from the page.
   */
  raw_content: string;
  /**
   * This is only available if {@link TavilyExtractParams.include_images} is set to `true`. A list
   * of image URLs extracted from the page.
   */
  images: string[];
} & Record<string, unknown>;

/**
 * A failed extraction result from the Tavily Extract API.
 */
export type TavilyFailedResult = {
  /**
   * The URL that failed to be processed.
   */
  url: string;
  /**
   * An error message describing why the URL couldn't be processed.
   */
  error: string;
} & Record<string, unknown>;

/**
 * The response from the Tavily Extract API.
 */
export type TavilyExtractResponse = {
  /**
   * A list of extracted content from the provided URLs.
   */
  results: TavilyExtractResult[];
  /**
   * A list of URLs that could not be processed.
   */
  failed_results: TavilyFailedResult[];
  /**
   * Time in seconds it took to complete the request.
   */
  response_time: number;
} & Record<string, unknown>;

/**
 * A single search result from the Tavily Search API.
 */
export type TavilySearchResult = {
  /**
   * The title of the search result.
   */
  title: string;
  /**
   * The URL of the search result.
   */
  url: string;
  /**
   * A short description of the search result.
   */
  content: string;
  /**
   * The relevance score of the search result.
   */
  score: number;
  /**
   * The cleaned and parsed HTML content of the search result. Only if
   * {@link TavilySearchParams.includeRawContent} is true.
   */
  raw_content: string | null;
} & Record<string, unknown>;

/**
 * The base response from the Tavily Search API.
 */
export type TavilyBaseSearchResponse = {
  /**
   * The search query that was executed.
   */
  query: string;
  /**
   * A short answer to the user's query, generated by an LLM. Included in the response only if
   * {@link TavilySearchParams.include_answer} is requested (i.e., set to `true`, `"basic"`, or
   * `"advanced"`).
   */
  answer?: string;
  /**
   * The results from the search.
   */
  results: TavilySearchResult[];
  /**
   * The response time of the search.
   */
  response_time: number;
} & Record<string, unknown>;

/**
 * The shape of the response from the Tavily Search API when
 * {@link TavilySearchParams.include_image_descriptions} is true.
 */
export type TavilySearchResponseWithImageDescriptions =
  TavilyBaseSearchResponse & {
    /**
     * List of query-related images. If {@link TavilySearchParams.include_image_descriptions} is
     * `true`, each item will be an object with `url` and `description` properties. Otherwise, each
     * item will be a string containing the URL of the image.
     */
    images?: {
      /**
       * The URL of the image.
       */
      url: string;
      /**
       * The description of the image.
       */
      description?: string;
    }[];
  };

/**
 * The shape of the response from the Tavily Search API when
 * {@link TavilySearchParams.include_image_descriptions} is `false` or unspecified.
 */
export type TavilySearchResponseWithSimpleImages = TavilyBaseSearchResponse & {
  /**
   * List of query-related images. If {@link TavilySearchParams.include_image_descriptions} is
   * `true`, each item will be an object with `url` and `description` properties. Otherwise, each
   * item will be a string containing the URL of the image.
   */
  images?: string[];
};

export type TavilySearchResponse =
  | TavilySearchResponseWithImageDescriptions
  | TavilySearchResponseWithSimpleImages;

/**
 * A wrapper that encapsulates access to the Tavily Search API. Primarily used for testing.
 */
export class TavilySearchAPIWrapper {
  tavilyApiKey?: string;

  /**
   * Constructs a new instance of the TavilySearchAPIWrapper.
   * @param fields The fields used to initialize the wrapper.
   */
  constructor(fields: {
    /**
     * The API key used for authentication with the Tavily Search API.
     *
     * If unspecified, the wrapper will use the API key found in the environment variable
     * `TAVILY_API_KEY`.
     */
    tavilyApiKey?: string;
  }) {
    const apiKey =
      fields.tavilyApiKey ?? getEnvironmentVariable("TAVILY_API_KEY");
    if (!apiKey) {
      throw new Error(
        "Tavily API key not found. Please provide it as an argument or set the TAVILY_API_KEY environment variable."
      );
    }
    this.tavilyApiKey = apiKey;
  }

  /**
   * Performs a search using the Tavily Search API.
   * @param params The parameters for the search.
   * @returns The raw response body from the Tavily Search API.
   */
  async rawResults(
    params: TavilySearchParamsWithSimpleImages
  ): Promise<TavilySearchResponseWithSimpleImages>;

  async rawResults(
    params: TavilySearchParamsWithImageDescriptions
  ): Promise<TavilySearchResponseWithImageDescriptions>;

  async rawResults(params: TavilySearchParams): Promise<TavilySearchResponse> {
    const headers = {
      Authorization: `Bearer ${this.tavilyApiKey}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(`${TAVILY_BASE_URL}/search`, {
      method: "POST",
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      console.log(response);
      const errorData = await response.json();
      const errorMessage = errorData.detail?.error || "Unknown error";
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    return response.json();
  }
}

/**
 * A wrapper that encapsulates access to the Tavily Extract API. Primarily used for testing.
 */
export class TavilyExtractAPIWrapper {
  tavilyApiKey?: string;

  /**
   * Constructs a new instance of the TavilyExtractAPIWrapper.
   * @param fields The fields used to initialize the wrapper.
   */
  constructor(fields: { tavilyApiKey?: string }) {
    const apiKey =
      fields.tavilyApiKey ?? getEnvironmentVariable("TAVILY_API_KEY");
    if (!apiKey) {
      throw new Error(
        "Tavily API key not found. Please provide it as an argument or set the TAVILY_API_KEY environment variable."
      );
    }
    this.tavilyApiKey = apiKey;
  }

  /**
   * Extracts content from one or more URLs using the Tavily Extract API.
   * @param params The parameters for the extraction. See {@link TavilyExtractParams}.
   * @returns The raw response body from the Tavily Extract API. See {@link TavilyExtractResponse}.
   */
  async rawResults(
    params: TavilyExtractParams
  ): Promise<TavilyExtractResponse> {
    const headers = {
      Authorization: `Bearer ${this.tavilyApiKey}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(`${TAVILY_BASE_URL}/extract`, {
      method: "POST",
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.detail?.error || "Unknown error";
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    return response.json();
  }
}
