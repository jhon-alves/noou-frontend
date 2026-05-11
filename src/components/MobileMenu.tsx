import React, { useState } from "react"
import { Menu, X } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Ajustar menu mobile para tablet

  const navigationItems = [
    {
      name: "Início",
      icon: (
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          <g clipPath="url(#clip0_191_6009)">
            <path
              d="M9.99984 5.39105L14.1665 9.14105V15.6494H12.4998V10.6494H7.49984V15.6494H5.83317V9.14105L9.99984 5.39105ZM9.99984 3.14938L1.6665 10.6494H4.1665V17.316H9.1665V12.316H10.8332V17.316H15.8332V10.6494H18.3332L9.99984 3.14938Z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      ),
      href: "/dashboard",
    },
    {
      name: "Assistente",
      icon: (
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          <g clipPath="url(#clip0_chat)">
            <path
              d="M16.6665 3.14938H3.33317C2.4165 3.14938 1.6665 3.89938 1.6665 4.81605V13.1494C1.6665 14.066 2.4165 14.816 3.33317 14.816H13.3332L17.4998 18.9827V4.81605C17.4998 3.89938 16.7498 3.14938 16.6665 3.14938ZM15.8332 16.1494L14.1665 14.4827H3.33317V4.81605H15.8332V16.1494ZM5.83317 7.31605H13.3332V8.98272H5.83317V7.31605ZM5.83317 10.6494H11.6665V12.316H5.83317V10.6494Z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      ),
      href: "/assistente",
    },
    {
      name: "Mentores",
      icon: (
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          <g clipPath="url(#clip0_191_6014)">
            <path
              d="M10.0002 3.14938L0.833496 8.14938L4.16683 9.96605V14.9661L10.0002 18.1494L15.8335 14.9661V9.96605L17.5002 9.05772V14.816H19.1668V8.14938L10.0002 3.14938ZM15.6835 8.14938L10.0002 11.2494L4.31683 8.14938L10.0002 5.04938L15.6835 8.14938ZM14.1668 13.9744L10.0002 16.2494L5.8335 13.9744V10.8744L10.0002 13.1494L14.1668 10.8744V13.9744Z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      ),
      href: "/mentores",
    },
    {
      name: "Executores",
      icon: (
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          <g clipPath="url(#clip0_191_6019)">
            <path
              d="M16.6665 6.48272H13.3332V4.81605L11.6665 3.14938H8.33317L6.6665 4.81605V6.48272H3.33317C2.4165 6.48272 1.6665 7.23272 1.6665 8.14938V12.316C1.6665 12.941 1.99984 13.466 2.49984 13.7577V16.4827C2.49984 17.4077 3.2415 18.1494 4.1665 18.1494H15.8332C16.7582 18.1494 17.4998 17.4077 17.4998 16.4827V13.7494C17.9915 13.4577 18.3332 12.9244 18.3332 12.316V8.14938C18.3332 7.23272 17.5832 6.48272 16.6665 6.48272ZM8.33317 4.81605H11.6665V6.48272H8.33317V4.81605ZM3.33317 8.14938H16.6665V12.316H12.4998V9.81605H7.49984V12.316H3.33317V8.14938ZM10.8332 13.1494H9.1665V11.4827H10.8332V13.1494ZM15.8332 16.4827H4.1665V13.9827H7.49984V14.816H12.4998V13.9827H15.8332V16.4827Z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      ),
      href: "/dashboard",
    },
    {
      name: "Prompts",
      icon: (
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          <g clipPath="url(#clip0_191_6029)">
            <path
              d="M16.6665 5.64938H9.99984L8.33317 3.98271H3.33317C2.4165 3.98271 1.67484 4.73271 1.67484 5.64938L1.6665 15.6494C1.6665 16.566 2.4165 17.316 3.33317 17.316H16.6665C17.5832 17.316 18.3332 16.566 18.3332 15.6494V7.31605C18.3332 6.39938 17.5832 5.64938 16.6665 5.64938ZM16.6665 15.6494H3.33317V5.64938H7.6415L9.30817 7.31605H16.6665V15.6494ZM14.9998 10.6494H4.99984V8.98271H14.9998V10.6494ZM11.6665 13.9827H4.99984V12.316H11.6665V13.9827Z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      ),
      href: "/prompts",
    },
    {
      name: "Templates",
      icon: (
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          <g clipPath="url(#clip0_191_6034)">
            <path
              d="M15.8333 8.98272V16.4827H4.15V4.81605H11.65V3.14938H4.16667C3.25 3.14938 2.5 3.89938 2.5 4.81605V16.4827C2.5 17.3994 3.25 18.1494 4.16667 18.1494H15.8333C16.75 18.1494 17.5 17.3994 17.5 16.4827V8.98272H15.8333ZM13.3833 7.26605L14.1667 8.98272L14.95 7.26605L16.6667 6.48272L14.95 5.69938L14.1667 3.98272L13.3833 5.69938L11.6667 6.48272L13.3833 7.26605ZM10 7.31605L8.95833 9.60772L6.66667 10.6494L8.95833 11.691L10 13.9827L11.0417 11.691L13.3333 10.6494L11.0417 9.60772L10 7.31605Z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      ),
      href: "/dashboard",
    },
    {
      name: "Prototipação",
      icon: (
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          <g clipPath="url(#clip0_191_6039)">
            <path
              d="M16.25 3.56605L15 2.31605L13.75 3.56605L12.5 2.31605L11.25 3.56605L10 2.31605L8.75 3.56605L7.5 2.31605L6.25 3.56605L5 2.31605V13.9827H2.5V16.4827C2.5 17.866 3.61667 18.9827 5 18.9827H15C16.3833 18.9827 17.5 17.866 17.5 16.4827V2.31605L16.25 3.56605ZM12.5 17.316H5C4.54167 17.316 4.16667 16.941 4.16667 16.4827V15.6494H12.5V17.316ZM15.8333 16.4827C15.8333 16.941 15.4583 17.316 15 17.316C14.5417 17.316 14.1667 16.941 14.1667 16.4827V13.9827H6.66667V4.81605H15.8333V16.4827Z"
              fill="currentColor"
            ></path>
            <path d="M12.5 6.48272H7.5V8.14938H12.5V6.48272Z" fill="currentColor"></path>
            <path d="M15.0002 6.48272H13.3335V8.14938H15.0002V6.48272Z" fill="currentColor"></path>
            <path d="M12.5 8.98272H7.5V10.6494H12.5V8.98272Z" fill="currentColor"></path>
            <path d="M15.0002 8.98272H13.3335V10.6494H15.0002V8.98272Z" fill="currentColor"></path>
          </g>
        </svg>
      ),
      href: "/dashboard",
    },
  ]

  const currentPath = location.pathname.replace(/\/+$/, "")

  const handleItemClick = (href: string) => {
    navigate(href)
    setIsOpen(false)
  }

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
        aria-label={isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menu Panel */}
      {isOpen && (
        <div
          className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-border z-50 shadow-xl flex flex-col md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal de navegação"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <img
              src="/logo.webp"
              alt="Logo da Noou - Página inicial"
              className="h-8 w-auto object-contain"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fechar menu de navegação"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav
            className="flex-1 overflow-y-auto p-4"
            role="navigation"
            aria-label="Itens de navegação mobile"
          >
            <div className="space-y-2">
              {navigationItems.map((item, index) => {
                const itemPath = item.href.replace(/\/+$/, "")
                const isActive = currentPath === itemPath

                return (
                  <button
                    key={index}
                    onClick={() => handleItemClick(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left ${
                      isActive
                        ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-sm"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                    aria-label={`Navegar para ${item.name}`}
                  >
                    <div
                      className={isActive ? "[&_path]:fill-white" : "[&_path]:fill-current"}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              © 2025 Noou - AI Ready, by design.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
