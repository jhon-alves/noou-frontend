import { api } from "../api"
import * as T from "./types"

export const integrationServices = {
  getIntegrationStatus,
}

function getIntegrationStatus(
  provider: T.Provider,
  business_id: number,
): Promise<T.IntegrationData> {
  return api.get(`/integrations/${provider}?business_id=${business_id}`)
}
