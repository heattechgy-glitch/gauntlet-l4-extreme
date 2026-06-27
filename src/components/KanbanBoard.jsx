import { useState } from "react";
import { ChevronRight, Plus, GripVertical } from "lucide-react";

const COLUMNS = [
  { id: "backlog", title: "Backlog", color: "bg-gray-700" },
  { id: "todo", title: "To Do", color: "bg-blue-700" },
  { id: "in_progress", title: "In Progress", color: "bg-yellow-700" },
  { id: "done", title: "Done", color: "bg-green-700" }
];

const PRIORITY_STYLES = {
  high: "bg-red-500 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-green-500 text-white"
};

export default function KanbanBoard({ cards = [], onMoveCard, onAddCard }) {
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (e, card) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (draggedCard && draggedCard.status !== columnId) {
      onMoveCard?.(draggedCard.id, columnId);
    }
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const getColumnCards = (columnId) => {
    return cards.filter(card => card.status === columnId);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full">
      {COLUMNS.map(column => {
        const columnCards = getColumnCards(column.id);
        const isDropTarget = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 bg-gray-800 rounded-lg flex flex-col"
          >
            {/* Column Header */}
            <div className={`${column.color} px-4 py-3 rounded-t-lg flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">{column.title}</h3>
                <span className="bg-black/20 text-white text-xs px-2 py-1 rounded-full">
                  {columnCards.length}
                </span>
              </div>
              <button
                onClick={() => onAddCard?.(column.id)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Add card"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Cards Container */}
            <div
              className={`flex-1 p-3 space-y-2 min-h-[200px] transition-colors ${
                isDropTarget ? "bg-gray-700" : ""
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {columnCards.map(card => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card)}
                  onDragEnd={handleDragEnd}
                  className={`bg-gray-900 border border-gray-700 rounded-lg p-3 cursor-move hover:border-sky-500 transition-all ${
                    draggedCard?.id === card.id ? "opacity-50" : ""
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start gap-2 mb-2">
                    <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    <h4 className="text-white text-sm font-medium flex-1 leading-tight">
                      {card.title}
                    </h4>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between mt-3">
                    {/* Priority Badge */}
                    {card.priority && (
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          PRIORITY_STYLES[card.priority.toLowerCase()] || PRIORITY_STYLES.low
                        }`}
                      >
                        {card.priority}
                      </span>
                    )}

                    {/* Assignee Initials */}
                    {card.assignee && (
                      <div
                        className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold"
                        title={card.assignee}
                      >
                        {getInitials(card.assignee)}
                      </div>
                    )}

                    {!card.priority && !card.assignee && (
                      <div className="text-gray-600 text-xs">No details</div>
                    )}
                  </div>
                </div>
              ))}

              {columnCards.length === 0 && (
                <div className="text-gray-600 text-sm text-center py-8">
                  No cards
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}