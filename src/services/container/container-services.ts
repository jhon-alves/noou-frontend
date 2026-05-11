import { api } from "../api"

type ContainerData = {
  container_id: string
  token: string
}

type ContainerBody = {
  business_id: number
}

const PROXY = "/agents-proxy"

export function createContainer(
  { business_id }: ContainerBody,
  signal?: AbortSignal,
): Promise<ContainerData> {
  return api.post(
    "/container/new",
    { business_id },
    {
      signal,
      headers: {
        "X-Silent-Error": true,
      },
    },
  )
}

export async function shutdownContainer(containerId: string, containerToken: string) {
  const url = `${PROXY}/${containerId}/health/shutdown`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(containerToken && { "X-Container-Token": containerToken }),
    },
    credentials: "include",
  })

  return response
}
