export type ReactionType = 'heart' | 'laugh' | 'cry';

export interface PhotoReaction {
  id: string;
  photo_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

export interface PhotoComment {
  id: string;
  photo_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
}

export interface ReactionCount {
  heart: number;
  laugh: number;
  cry: number;
}
