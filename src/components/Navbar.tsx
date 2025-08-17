"use client";

import React, { useState } from 'react';
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';
import { ChevronDown, Menu, X, Palette, Layers3, Smartphone, Gamepad2, Zap, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const services = {
    tatuaze: {
      title: "Tatuaże",
      icon: <Zap className="w-4 h-4" />,
      items: [
        { name: "Minimalistyczne", desc: "Delikatne, subtelne projekty", icon: <Sparkles className="w-4 h-4" /> },
        { name: "Geometryczne", desc: "Precyzyjne wzory i kształty", icon: <Layers3 className="w-4 h-4" /> },
        { name: "Fine Line", desc: "Cienkie linie, szczegółowe", icon: <Palette className="w-4 h-4" /> },
        { name: "Sketch Style", desc: "Artystyczne szkice", icon: <Palette className="w-4 h-4" /> }
      ]
    },
    grafika3d: {
      title: "Grafika 3D",
      icon: <Layers3 className="w-4 h-4" />,
      items: [
        { name: "Postacie 3D", desc: "Modelowanie charakterów", icon: <Smartphone className="w-4 h-4" /> },
        { name: "Game Assets", desc: "Zasoby do gier indie", icon: <Gamepad2 className="w-4 h-4" /> },
        { name: "Stylized Models", desc: "Stylizowane modele 3D", icon: <Layers3 className="w-4 h-4" /> },
        { name: "Wizualizacje", desc: "Produkty i koncepty", icon: <Palette className="w-4 h-4" /> }
      ]
    }
  };

  const menuItems = [
    { name: "Start", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "O mnie", href: "/o-mnie" },
    { name: "Kontakt", href: "/kontakt" }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  const ServiceDropdown = ({ serviceKey, service }) => (
    <motion.div
      className="absolute top-full left-0 mt-2 w-80 bg-background border-4 border-foreground rounded-lg shadow-[8px_8px_0px_0px_theme(colors.foreground)] z-50"
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4 text-primary">
          {service.icon}
          <h3 className="font-bold text-lg">{service.title}</h3>
        </div>
        <div className="grid gap-3">
          {service.items.map((item, index) => (
            <motion.a
              key={item.name}
              href={`/uslugi/${serviceKey}/${item.name.toLowerCase().replace(' ', '-')}`}
              className="group flex items-start gap-3 p-3 rounded border-2 border-transparent hover:border-foreground hover:bg-accent hover:shadow-[4px_4px_0px_0px_theme(colors.foreground)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="text-accent mt-1 group-hover:text-primary transition-colors">
                {item.icon}
              </div>
              <div>
                <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {item.desc}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
        <motion.div 
          className="mt-4 pt-4 border-t-2 border-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <a 
            href={`/uslugi/${serviceKey}`}
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors font-bold px-3 py-2 border-2 border-transparent hover:border-foreground hover:shadow-[2px_2px_0px_0px_theme(colors.foreground)] rounded"
          >
            Zobacz wszystkie usługi
            <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
          </a>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <motion.nav
      className="fixed top-10 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-[1240px] mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-background border-4 border-foreground rounded-lg shadow-[8px_8px_0px_0px_theme(colors.foreground)]">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center space-x-3 group"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded border-4 border-foreground flex items-center justify-center group-hover:shadow-[4px_4px_0px_0px_theme(colors.foreground)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-all duration-200 shadow-[2px_2px_0px_0px_theme(colors.foreground)]">
              <span className="text-primary-foreground font-bold text-lg font-primary">I</span>
            </div>
            <span className="text-2xl font-primary font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              iovi-ink
            </span>
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-bold relative group px-3 py-2 rounded hover:bg-accent/20 hover:shadow-[2px_2px_0px_0px_theme(colors.foreground)] hover:translate-x-[-1px] hover:translate-y-[-1px] border-2 border-transparent hover:border-foreground transition-all duration-200"
                variants={itemVariants}
              >
                {item.name}
              </motion.a>
            ))}

            {/* Services Dropdown */}
            <div className="relative">
              <motion.button
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-bold group px-3 py-2 rounded hover:bg-accent/20 hover:shadow-[2px_2px_0px_0px_theme(colors.foreground)] hover:translate-x-[-1px] hover:translate-y-[-1px] border-2 border-transparent hover:border-foreground transition-all duration-200"
                variants={itemVariants}
                onMouseEnter={() => setActiveDropdown('services')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                Usługi
                <motion.div
                  animate={{ rotate: activeDropdown === 'services' ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {activeDropdown === 'services' && (
                  <motion.div
                    className="absolute top-full left-0 mt-4 w-96 bg-background border-4 border-foreground rounded-lg shadow-[8px_8px_0px_0px_theme(colors.foreground)]"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onMouseEnter={() => setActiveDropdown('services')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4 text-foreground">Nasze Usługi</h3>
                      <div className="grid gap-4">
                        {Object.entries(services).map(([key, service], index) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <a
                              href={`/uslugi/${key}`}
                              className="group flex items-center gap-3 p-4 rounded border-2 border-transparent hover:border-foreground hover:bg-accent hover:shadow-[4px_4px_0px_0px_theme(colors.foreground)] transition-all duration-200"
                            >
                              <div className="text-accent group-hover:text-primary transition-colors">
                                {service.icon}
                              </div>
                              <div>
                                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                  {service.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {service.items.length} specjalizacji
                                </div>
                              </div>
                              <ChevronDown className="w-4 h-4 ml-auto rotate-[-90deg] text-muted-foreground group-hover:text-primary transition-colors" />
                            </a>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <motion.a
              href="/kontakt"
              className="bg-primary border-4 border-foreground text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-accent hover:shadow-[6px_6px_0px_0px_theme(colors.foreground)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 shadow-[4px_4px_0px_0px_theme(colors.foreground)]"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Rozpocznij projekt
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded border-2 border-foreground hover:bg-accent hover:shadow-[4px_4px_0px_0px_theme(colors.foreground)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200"
            variants={itemVariants}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-4 border-t-4 border-foreground bg-background"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="py-6 space-y-4 px-6">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-3 text-foreground font-bold border-2 border-transparent hover:border-foreground hover:bg-accent hover:shadow-[4px_4px_0px_0px_theme(colors.foreground)] rounded transition-all duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
                
                <div className="px-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Usługi</div>
                  {Object.entries(services).map(([key, service], index) => (
                    <motion.a
                      key={key}
                      href={`/uslugi/${key}`}
                      className="flex items-center gap-3 px-4 py-3 text-foreground font-bold border-2 border-transparent hover:border-foreground hover:bg-accent hover:shadow-[4px_4px_0px_0px_theme(colors.foreground)] rounded transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (menuItems.length + index) * 0.1 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {service.icon}
                      {service.title}
                    </motion.a>
                  ))}
                </div>

                <motion.a
                  href="/kontakt"
                  className="block text-center bg-primary border-4 border-foreground text-primary-foreground px-6 py-4 rounded font-bold hover:bg-accent hover:shadow-[6px_6px_0px_0px_theme(colors.foreground)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 shadow-[4px_4px_0px_0px_theme(colors.foreground)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Rozpocznij projekt
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;