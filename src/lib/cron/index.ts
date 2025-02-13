import axios from "axios";

export interface CronJobPayload {
  job: {
    url: string;
    title?: string;
    enabled?: boolean;
    saveResponses?: boolean;
    schedule?: {
      timezone?: string;
      expiresAt?: number | string;
      hours?: number[];
      mdays?: number[];
      minutes?: number[];
      months?: number[];
      wdays?: number[];
    };
    requestTimeout?: number;
    auth?: {
      enable: boolean;
      user?: string;
      password?: string;
    };
    notification?: {
      onFailure: boolean;
      onSuccess: boolean;
      onDisable: boolean;
    };
    requestMethod?: number;
    extendedData?: {
      headers?: Record<string, string>;
      body?: string;
    };
  };
}
export const CRON_REQUEST_METHOD = {
  GET: 0,
  POST: 1,
  OPTIONS: 2,
  HEAD: 3,
  PUT: 4,
  DELETE: 5,
  TRACE: 6,
  CONNECT: 7,
  PATCH: 8,
} as const;
export class CronJobHandler {
  private static readonly API_URL = "https://api.cron-job.org";
  private static readonly API_KEY = process.env.CRON_JOB_API_KEY;

  private static async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const response = await axios({
        method,
        url: `${this.API_URL}${endpoint}`,
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          "Content-Type": "application/json",
        },
        data,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Cron-job.org API error: ${
            error.response?.data?.error || error.message
          }`
        );
      }
      throw error;
    }
  }

  static async addJob(payload: CronJobPayload) {
    if (!payload.job?.url) {
      throw new Error("Job URL is required");
    }

    return this.makeRequest<{ jobId: number }>("PUT", "/jobs", payload);
  }

  static async deleteJob(jobId: string | number) {
    if (!jobId) {
      throw new Error("Job ID is required");
    }

    return this.makeRequest<void>("DELETE", `/jobs/${jobId}`);
  }

  static async updateJob(jobId: string | number, payload: CronJobPayload) {
    if (!jobId) {
      throw new Error("Job ID is required");
    }
    if (!payload.job?.url) {
      throw new Error("Job URL is required");
    }

    return this.makeRequest<void>("PATCH", `/jobs/${jobId}`, payload);
  }

  static async getJob(jobId: string | number) {
    if (!jobId) {
      throw new Error("Job ID is required");
    }

    return this.makeRequest<{ jobDetails: CronJobPayload["job"] }>(
      "GET",
      `/jobs/${jobId}`
    );
  }
}
