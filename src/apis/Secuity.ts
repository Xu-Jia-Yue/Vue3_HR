import { request } from '@/util/request'

export function getArchivingCont(params: any) {
  return request({
    url: `/social_securitys/historys/${params.month}`,
    params
  })
}
