import { useState } from 'react';
import { Send, Trash2, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePhotoComments, useAddComment, useDeleteComment } from '@/hooks/usePhotoInteractions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface PhotoCommentsProps {
  photoId: string;
  className?: string;
}

export function PhotoComments({ photoId, className }: PhotoCommentsProps) {
  const { user } = useAuth();
  const { data: comments, isLoading } = usePhotoComments(photoId);
  const addComment = useAddComment();
  const deleteComment = useDeleteComment();
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to comment.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      await addComment.mutateAsync({ photoId, content: newComment });
      setNewComment('');
      toast({ title: "Comment added!" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add comment. Try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment.mutateAsync({ commentId, photoId });
      toast({ title: "Comment deleted" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete comment.",
        variant: "destructive",
      });
    }
  };

  const commentCount = comments?.length || 0;

  return (
    <div className={`${className}`}>
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-sm font-medium">
          {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
        </span>
      </button>

      {/* Expanded comments panel */}
      {isExpanded && (
        <div className="absolute bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-background/95 backdrop-blur-sm rounded-2xl border border-border shadow-2xl overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Comments</h3>
          </div>

          {/* Comments list */}
          <div className="max-h-64 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </p>
                      <p className="text-sm text-foreground break-words">{comment.content}</p>
                    </div>
                    {user?.id === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive transition-all"
                        disabled={deleteComment.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">
                No comments yet. Be the first!
              </p>
            )}
          </div>

          {/* Add comment form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border">
            {user ? (
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  maxLength={500}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={addComment.isPending || !newComment.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                <a href="/login" className="text-primary hover:underline">Log in</a> to comment
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
