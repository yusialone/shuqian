"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Plus, Moon, Sun, ExternalLink, Trash2, Pencil, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Bookmark {
  id: string
  title: string
  description: string
  url: string
  category: string
  favorite?: boolean // 新增
}



const categories = [
  "全部",
  "常用页", // 新增
  "AI 工具",
  "学术研究",
  "编程与开发",
  "工具与平台",
  "资源网站",
  "网络服务与机场",
  "同济大学",
  "学习与答题",
  "影音娱乐",
  "游戏与壁纸",
  "社区与论坛",
  "文旅资讯",
  "生活百科",
  "其他",
]


export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部") // 初始为"全部"
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newBookmark, setNewBookmark] = useState({
    title: "",
    description: "",
    url: "",
    category: "Development",
  })
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    url: "",
    category: "Development",
  })

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((bookmark) => {
      const matchesSearch =
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(searchTerm.toLowerCase())
      let matchesCategory = false
      if (selectedCategory === "全部") {
        matchesCategory = true
      } else if (selectedCategory === "常用页") {
        matchesCategory = !!bookmark.favorite
      } else {
        matchesCategory = bookmark.category === selectedCategory
      }
      return matchesSearch && matchesCategory
    })
  }, [bookmarks, searchTerm, selectedCategory])

  // 拉取书签数据
  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch('https://nezha1.yusi1.dpdns.org/api/bookmarks')
      .then(res => res.json())
      .then(data => setBookmarks(data))
      .catch(e => setError('加载书签失败'))
      .finally(() => setLoading(false))
  }, [])

  // 添加书签
  const handleAddBookmark = async () => {
    if (newBookmark.title && newBookmark.url) {
      setLoading(true)
      setError(null)
      const bookmark: Bookmark = {
        id: Date.now().toString(),
        ...newBookmark,
      }
      try {
        const res = await fetch('https://nezha1.yusi1.dpdns.org/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookmark),
        })
        if (!res.ok) throw new Error('添加失败')
        setBookmarks(prev => [...prev, bookmark])
        setNewBookmark({ title: "", description: "", url: "", category: "Development" })
        setIsAddDialogOpen(false)
      } catch (e) {
        setError('添加书签失败')
      } finally {
        setLoading(false)
      }
    }
  }

  // 删除书签
  const handleDeleteBookmark = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://nezha1.yusi1.dpdns.org/api/bookmarks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('删除失败')
      setBookmarks(prev => prev.filter((bookmark) => bookmark.id !== id))
    } catch (e) {
      setError('删除书签失败')
    } finally {
      setLoading(false)
    }
  }

  // 编辑书签
  const handleEditSave = async () => {
    if (!editingBookmark) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://nezha1.yusi1.dpdns.org/api/bookmarks/${editingBookmark.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editForm }),
      })
      if (!res.ok) throw new Error('编辑失败')
      setBookmarks(prev => prev.map(b => b.id === editingBookmark.id ? { ...b, ...editForm } : b))
      setEditingBookmark(null)
    } catch (e) {
      setError('编辑书签失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  return (
    <div
      style={{
        backgroundImage: 'url(https://cloudflare-imgbed-aef.pages.dev/file/1730429865680_wlop126.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <div
        className="relative z-10 container mx-auto px-4 py-8 backdrop-blur-md bg-white/60 dark:bg-black/40 rounded-2xl shadow-lg mt-8"
        style={{
          minHeight: 'calc(100vh - 4rem)',
          maxHeight: 'calc(100vh - 4rem)',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>YUSI的书签盒</h1>
            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              管理和发现你喜欢的网站
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`backdrop-blur-md border-white/20 ${
                isDarkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/10 hover:bg-black/20 text-gray-900"
              }`}
            >
              {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className={`backdrop-blur-md ${
                    isDarkMode
                      ? "bg-purple-600/80 hover:bg-purple-700/80 text-white"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  } border-0`}
                >
                  <Plus className="h-6 w-6 mr-2" />
                  添加书签
                </Button>
              </DialogTrigger>
              <DialogContent
                className={`backdrop-blur-md ${
                  isDarkMode ? "bg-gray-900/90 border-white/20 text-white" : "bg-white/90 border-gray-200"
                }`}
              >
                <DialogHeader>
                  <DialogTitle>添加新书签</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">标题</Label>
                    <Input
                      id="title"
                      value={newBookmark.title}
                      onChange={(e) => setNewBookmark((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="请输入标题"
                      className={`backdrop-blur-md ${
                        isDarkMode ? "bg-white/10 border-white/20 text-white" : "bg-black/5 border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">网址</Label>
                    <Input
                      id="url"
                      value={newBookmark.url}
                      onChange={(e) => setNewBookmark((prev) => ({ ...prev, url: e.target.value }))}
                      placeholder="请输入网址"
                      className={`backdrop-blur-md ${
                        isDarkMode ? "bg-white/10 border-white/20 text-white" : "bg-black/5 border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">描述</Label>
                    <Textarea
                      id="description"
                      value={newBookmark.description}
                      onChange={(e) => setNewBookmark((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="请输入描述"
                      className={`backdrop-blur-md ${
                        isDarkMode ? "bg-white/10 border-white/20 text-white" : "bg-black/5 border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">分类</Label>
                    <Select
                      value={newBookmark.category}
                      onValueChange={(value: string) => setNewBookmark((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger
                        className={`backdrop-blur-md ${
                          isDarkMode ? "bg-white/10 border-white/20 text-white" : "bg-black/5 border-gray-300"
                        }`}
                      >
                        <SelectValue placeholder="请选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((cat) => cat !== "All")
                          .map((category) => (
                            <SelectItem key={category} value={category}>
                              {category === 'Development' ? '开发' : category === 'Design' ? '设计' : category === 'News' ? '资讯' : category === 'Tools' ? '工具' : category}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddBookmark} className="w-full bg-purple-600 hover:bg-purple-700">
                    添加书签
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <Input
              placeholder="搜索书签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 backdrop-blur-md border-white/20 ${
                isDarkMode ? "bg-white/10 text-white placeholder:text-gray-400" : "bg-black/5 border-gray-300"
              }`}
            />
          </div>

          <Select value={selectedCategory} onValueChange={(value: string) => setSelectedCategory(value)}>
            <SelectTrigger
              className={`w-full md:w-48 backdrop-blur-md border-white/20 ${
                isDarkMode ? "bg-white/10 text-white" : "bg-black/5 border-gray-300"
              }`}
            >
              <SelectValue placeholder="全部分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'All' ? '全部' : category === 'Development' ? '开发' : category === 'Design' ? '设计' : category === 'News' ? '资讯' : category === 'Tools' ? '工具' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bookmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
          {filteredBookmarks.map((bookmark, index) => (
            <div
              key={bookmark.id}
              className={`group relative backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer h-64 ${
                isDarkMode
                  ? "bg-white/10 border border-white/20 hover:bg-white/20 hover:shadow-purple-500/25"
                  : "bg-white/60 border border-white/40 hover:bg-white/80 hover:shadow-purple-500/25"
              }`}
              onClick={() => window.open(bookmark.url, "_blank")}
            >
              <div className="flex flex-col h-full">
                {/* Favorite Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    setBookmarks((prev) => prev.map((b) => b.id === bookmark.id ? { ...b, favorite: !b.favorite } : b))
                  }}
                  className={`absolute top-2 right-20 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto h-8 w-8 md:opacity-0 md:group-hover:opacity-100 opacity-100 ${
                    bookmark.favorite
                      ? isDarkMode
                        ? "text-pink-400 hover:text-pink-300"
                        : "text-pink-500 hover:text-pink-600"
                      : isDarkMode
                        ? "text-gray-400 hover:text-pink-400"
                        : "text-gray-400 hover:text-pink-500"
                  }`}
                  title={bookmark.favorite ? "移除常用页" : "添加到常用页"}
                >
                  <Heart fill={bookmark.favorite ? (isDarkMode ? "#f472b6" : "#ec4899") : "none"} className="h-6 w-6" />
                </Button>
                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteBookmark(bookmark.id)
                  }}
                  className={`absolute top-2 right-12 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto h-8 w-8 md:opacity-0 md:group-hover:opacity-100 opacity-100 ${
                    isDarkMode
                      ? "hover:bg-red-500/20 text-red-400 hover:text-red-300"
                      : "hover:bg-red-500/20 text-red-500 hover:text-red-600"
                  }`}
                >
                  <Trash2 className="h-6 w-6" />
                </Button>
                {/* Edit Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditSave()
                  }}
                  className={`absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto h-8 w-8 md:opacity-0 md:group-hover:opacity-100 opacity-100 ${
                    isDarkMode
                      ? "hover:bg-blue-500/20 text-blue-400 hover:text-blue-300"
                      : "hover:bg-blue-500/20 text-blue-500 hover:text-blue-600"
                  }`}
                >
                  <Pencil className="h-6 w-6" />
                </Button>

                {/* Favicon and Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isDarkMode ? "bg-white/20" : "bg-black/10"
                      }`}
                    >
                      <img
                        src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(bookmark.url)}&size=32`}
                        alt={`${bookmark.title} favicon`}
                        className="w-8 h-8"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode ? "bg-purple-500/20 text-purple-300" : "bg-purple-500/20 text-purple-700"
                    }`}
                  >
                    {bookmark.category === 'Development' ? '开发' : bookmark.category === 'Design' ? '设计' : bookmark.category === 'News' ? '资讯' : bookmark.category === 'Tools' ? '工具' : bookmark.category}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3 flex-1">
                  <h3 className={`font-semibold text-lg leading-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {bookmark.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed line-clamp-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {bookmark.description}
                  </p>
                </div>

                {/* URL */}
                <div className="mt-auto pt-3">
                  <p className={`text-xs truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{bookmark.url}</p>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBookmarks.length === 0 && (
          <div className="text-center py-16">
            <div className={`text-6xl mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}>🔍</div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              没有找到书签
            </h3>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              请尝试调整搜索或筛选条件
            </p>
          </div>
        )}

        {/* Edit Bookmark Dialog */}
        <Dialog open={!!editingBookmark} onOpenChange={(open) => { if (!open) setEditingBookmark(null) }}>
          <DialogContent
            className={`backdrop-blur-md ${
              isDarkMode ? "bg-gray-900/90 border-white/20 text-white" : "bg-white/90 border-gray-200"
            }`}
          >
            <DialogHeader>
              <DialogTitle>编辑书签</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">标题</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="请输入标题"
                  className={`backdrop-blur-md ${
                    isDarkMode ? "bg-white/10 border-white/20 text-white" : "bg-black/5 border-gray-300"
                  }`}
                />
              </div>
              <div>
                <Label htmlFor="edit-url">网址</Label>
                <Input
                  id="edit-url"
                  value={editForm.url}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="请输入网址"
                  className={`backdrop-blur-md ${
                    isDarkMode ? "bg-white/10 border-white/20 text-white" : "bg-black/5 border-gray-300"
                  }`}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">描述</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="请输入描述"
                  className={`backdrop-blur-md ${
                    isDarkMode ? "bg-white/10 border-white/20 text-white" : "bg-black/5 border-gray-300"
                  }`}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">分类</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value: string) => setEditForm((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger
                    className={`backdrop-blur-md ${
                      isDarkMode ? "bg-white/10 border-white/20 text-white" : "bg-black/5 border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="请选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat !== "All")
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === 'Development' ? '开发' : category === 'Design' ? '设计' : category === 'News' ? '资讯' : category === 'Tools' ? '工具' : category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEditSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">保存</Button>
                <Button variant="outline" onClick={() => setEditingBookmark(null)} className="flex-1">取消</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 