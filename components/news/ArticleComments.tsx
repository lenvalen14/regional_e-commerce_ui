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
    <section ref={ref} className="py-20 bg-white border-t border-[#e0e0e0]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className={`text-center mb-16 ${inView ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
          <h3 className="text-2xl md:text-3xl font-beaululo text-[#222] mb-4 tracking-widest uppercase">
            Bình luận ({comments.length})
          </h3>
          <div className="w-16 h-px bg-[#8FBC8F] mx-auto" />
        </div>

        {/* Comment Form */}
        <div className={`mb-16 ${inView ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 delay-200`}>
          <form onSubmit={handleSubmitComment} className="border border-[#e0e0e0] bg-white p-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-[#f5f5f5] rounded-full flex-shrink-0" />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Chia sẻ suy nghĩ của bạn về bài viết..."
                  className="w-full p-4 border border-[#e0e0e0] focus:border-[#8FBC8F] focus:outline-none transition-colors duration-300 resize-none font-nitti"
                  rows={4}
                />
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-[#8FBC8F] text-white px-6 py-3 font-nitti text-sm tracking-widest uppercase hover:bg-[#7aa87a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-12">
          {comments.map((comment, index) => (
            <div 
              key={comment.id}
              className={`${inView ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
              style={{ transitionDelay: `${(index + 1) * 300}ms` }}
            >
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-[#f5f5f5] rounded-full flex-shrink-0" />
                
                <div className="flex-1">
                  <div className="bg-white border border-[#e0e0e0] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <h5 className="font-beaululo text-[#222] text-sm tracking-widest uppercase">{comment.author}</h5>
                        <span className="text-xs text-[#888] font-nitti">{comment.date}</span>
                      </div>
                      
                      <button className="flex items-center gap-1 text-xs text-[#888] hover:text-[#8FBC8F] transition-colors duration-300 font-nitti">
                        <ThumbsUp className="h-3 w-3" />
                        {comment.likes}
                      </button>
                    </div>
                    
                    <p className="text-[#444] leading-relaxed mb-4 font-nitti">{comment.content}</p>
                    
                    <button className="text-xs text-[#8FBC8F] hover:text-[#7aa87a] transition-colors duration-300 flex items-center gap-1 font-nitti tracking-widest uppercase">
                      <Reply className="h-3 w-3" />
                      Trả lời
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-12 mt-6 space-y-6">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-4">
                          <div className="w-8 h-8 bg-[#f5f5f5] rounded-full flex-shrink-0" />
                          <div className="flex-1 bg-[#fafafa] border border-[#e0e0e0] p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <h6 className="font-beaululo text-[#222] text-xs tracking-widest uppercase">{reply.author}</h6>
                              {reply.isAuthor && (
                                <span className="bg-[#8FBC8F] text-white px-2 py-1 text-xs font-nitti tracking-widest uppercase">Tác giả</span>
                              )}
                              <span className="text-xs text-[#888] font-nitti">{reply.date}</span>
                            </div>
                            <p className="text-xs text-[#444] font-nitti">{reply.content}</p>
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
        <div className="text-center mt-16">
          <button className="border border-[#e0e0e0] text-[#666] px-8 py-3 font-nitti text-sm tracking-widest uppercase hover:border-[#8FBC8F] hover:text-[#8FBC8F] transition-colors duration-300">
            Xem thêm bình luận
          </button>
        </div>
      </div>
    </section>
  );
}