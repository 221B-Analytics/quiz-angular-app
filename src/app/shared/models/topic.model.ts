import { Common } from "src/app/core/models/common.model";

export interface Topic extends Common {
  _id?: number;
  name?: string;
  description?: string;
  imageUrl?: string;
  resources?: any[];
  selected?: boolean;
}
