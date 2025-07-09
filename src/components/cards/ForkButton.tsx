"use client";

import { useState } from "react";
import { GitBranch } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useAuth } from "~/lib/hooks/useAuth";
import { ForkDialog } from "./ForkDialog";

interface ForkButtonProps {
  card: {
    id: string;
    title: string;
    description: string;
    promptText: string;
    category: {
      id: string;
      name: string;
    };
    aiModel: {
      id: string;
      name: string;
    };
    author: {
      id: string;
      username: string;
      displayName: string;
    };
  };
  className?: string;
}

export function ForkButton({ card, className }: ForkButtonProps) {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleForkClick = () => {
    if (!user) {
      toast.error("Please sign in to fork cards");
      return;
    }

    // Don't allow forking your own cards
    if (user.id === card.author.id) {
      toast.error("You cannot fork your own cards");
      return;
    }

    setIsDialogOpen(true);
  };

  const handleForkSuccess = () => {
    setIsDialogOpen(false);
    toast.success("Card forked successfully!");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleForkClick}
          className={className}
        >
          <GitBranch className="mr-2 h-4 w-4" />
          Fork
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Fork Card</DialogTitle>
        </DialogHeader>
        <ForkDialog
          parentCard={card}
          onSuccess={handleForkSuccess}
          onCancel={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
