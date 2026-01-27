"use client";

import { Bell, HelpCircle, Menu, Search } from "lucide-react";
import * as React from "react";

import { cn } from "../../libs/cn";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { Sidebar } from "./sidebar";

export function Navbar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-white/5 bg-slate-950/80 backdrop-blur-md px-4 transition-all lg:px-6",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-400"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-72 border-r border-white/10 bg-slate-950"
          >
            <Sidebar className="border-none bg-transparent" />
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex flex-col">
          <span className="text-sm font-medium text-white">Dashboard</span>
          <span className="text-[10px] text-slate-500">Overview & Stats</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <button className="group flex h-9 w-full max-w-md items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.99]">
          <Search className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
          <span className="flex-1 text-left truncate">
            Buscar clientes, pedidos...
          </span>
          {/* Shortcut Badge visual */}
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-slate-400 hover:text-white hover:bg-white/5"
        >
          <HelpCircle className="h-4.5 w-4.5" />
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-400 hover:text-white hover:bg-white/5"
          >
            <Bell className="h-4.5 w-4.5" />
          </Button>
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
        </div>

        <div className="mx-2 h-6 w-px bg-white/10" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-auto gap-2 px-2 hover:bg-white/5 rounded-full md:rounded-lg"
            >
              <Avatar className="h-6 w-6 border border-white/10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="text-[10px] bg-indigo-600 text-white">
                  JD
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-xs font-medium text-slate-300">
                Jelil A.
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-slate-950 border border-white/10 text-slate-300"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white">
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
