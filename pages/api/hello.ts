import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // profiles 테이블에서 첫 번째 레코드만 가져오기
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    // 에러가 있으면 500으로 반환
    return res.status(500).json({ error: error.message });
  }

  // 정상 데이터 반환
  res.status(200).json({ testProfiles: data });
}
