"use client";

import { useState } from "react";
import { AlertNote } from "@/types/alert.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { formatTimeAgo } from "@/utils/transformer.utils";

interface AlertNotesProps {
  notes: AlertNote[];
  alertId: string;
  onAddNote?: (content: string) => void;
}

export function AlertNotes({ notes, alertId, onAddNote }: AlertNotesProps) {
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Please enter a note");
      return;
    }
    if (onAddNote) {
      onAddNote(newNote);
    }
    setNewNote("");
    setIsAdding(false);
    toast.success("Note added");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Notes</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Note
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-4 space-y-2">
            <Textarea
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddNote}>
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Post Note
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewNote("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {notes.length === 0 ? (
          <div className="text-center py-4 text-sm text-slate-400">
            No notes yet
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="flex gap-3 rounded-lg border p-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    {note.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{note.userName}</span>
                    <span className="text-xs text-slate-400">
                      {formatTimeAgo(note.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {note.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
