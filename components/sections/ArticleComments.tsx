'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { MessageCircle, ThumbsUp, Reply, Send } from 'lucide-react';

export function ArticleComments() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Nguyễn Thị Lan',
      avatar: '/images/avatar1.jpg',
      content: 'Bài viết rất hay và chi tiết! Mình đã từng đến Phú Quốc và được tận mắt chứng kiến quy trình làm nước mắm. Thật sự rất ấn tượng.',
      date: '2 giờ trước',
      likes: 5,
      replies: [
        {
          id: 11,
          author: 'Minh An',
          content: 'Cảm ơn bạn đã chia sẻ! Rất vui khi bài viết có thể gợi lại những kỷ niệm đẹp của bạn.',
          date: '1 giờ trước',
          isAuthor: true
        }
      ]
    },
    {
      id: 2,
      author: 'Trần Văn Minh',
      avatar: '/images/avatar2.jpg',
      content: 'Gia đình mình làm nghề này đã 3 đời. Cảm ơn tác giả đã viết về nghề truyền thống của chúng tôi một cách tôn trọng và chính xác.',
      date: '5 giờ trước',
      likes: 12,
      replies: []
    }
  ]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'Bạn',
        avatar: '/images/user-avatar.jpg',
        content: newComment,
        date: 'Vừa xong',
        likes: 0,
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-12 ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h3 className="text-2xl md:text-3xl font-serif text-amber-900 mb-4">
              Bình luận ({comments.length})
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto" />
          </div>

          {/* Comment Form */}
          <div className={`mb-12 ${inView ? 'animate-slideInFromBottom' : 'opacity-0'}`}>
            <form onSubmit={handleSubmitComment} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Chia sẻ suy nghĩ của bạn về bài viết..."
                    className="w-full p-4 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors duration-300 resize-none"
                    rows={4}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full font-semibold hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Gửi bình luận
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-8">
            {comments.map((comment, index) => (
              <div 
                key={comment.id}
                className={`${inView ? 'animate-slideInFromBottom' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex-shrink-0" />
                  
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h5 className="font-semibold text-amber-900">{comment.author}</h5>
                          <span className="text-sm text-gray-500">{comment.date}</span>
                        </div>
                        
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-amber-600 transition-colors duration-300">
                          <ThumbsUp className="h-4 w-4" />
                          {comment.likes}
                        </button>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-4">{comment.content}</p>
                      
                      <button className="text-sm text-amber-600 hover:text-orange-600 transition-colors duration-300 flex items-center gap-1">
                        <Reply className="h-4 w-4" />
                        Trả lời
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="ml-8 mt-4 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex-shrink-0" />
                            <div className="flex-1 bg-amber-50 rounded-xl p-4 border border-amber-100">
                              <div className="flex items-center gap-2 mb-2">
                                <h6 className="font-semibold text-amber-900 text-sm">{reply.author}</h6>
                                {reply.isAuthor && (
                                  <span className="bg-amber-600 text-white px-2 py-1 rounded-full text-xs">Tác giả</span>
                                )}
                                <span className="text-xs text-gray-500">{reply.date}</span>
                              </div>
                              <p className="text-sm text-gray-700">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Comments */}
          <div className="text-center mt-12">
            <button className="bg-amber-100 text-amber-800 px-6 py-3 rounded-full font-semibold hover:bg-amber-200 transition-colors duration-300">
              Xem thêm bình luận
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}