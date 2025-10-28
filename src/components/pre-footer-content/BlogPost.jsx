import Image from "next/image"


export const BlogPost = ({ heading, blogPosts }) => {
  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
         <div className="container mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-4xl font-bold text-gray-800 mb-4">{heading}</h2>
            
           </div>
           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
             {blogPosts.map((post) => (
               <article
                 key={post.id}
                 className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 border border-gray-100"
               >
                 <div className="relative w-full h-64">
                   <Image
                     src={post.image}
                     alt={post.title}
                     fill
                     className="object-cover hover:scale-105 transition-transform duration-300"
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   />
                 </div>
                 <div className="p-6">
                   <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight hover:text-blue-700 transition-colors">
                     {post.title}
                   </h3>
                   <div className="text-gray-600 text-sm">
                     {post.description}
                   </div>
                 </div>
               </article>
             ))}
           </div>
         </div>
       </section>
  )
}
