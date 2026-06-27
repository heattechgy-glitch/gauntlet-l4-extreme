import { createContext, useContext, useReducer, useEffect } from "react";

const BoardContext = createContext();

const STORAGE_KEY = "gauntlet_board_state";

const initialState = {
  columns: {
    todo: {
      id: "todo",
      title: "Todo",
      cards: []
    },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      cards: []
    },
    review: {
      id: "review",
      title: "Review",
      cards: []
    },
    done: {
      id: "done",
      title: "Done",
      cards: []
    }
  }
};

function boardReducer(state, action) {
  switch (action.type) {
    case "LOAD_STATE": {
      return action.payload;
    }

    case "ADD_CARD": {
      const { column, title, desc = "", assignee = "", priority = "medium", tags = [] } = action.payload;
      const newCard = {
        id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        desc,
        assignee,
        priority,
        tags,
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        columns: {
          ...state.columns,
          [column]: {
            ...state.columns[column],
            cards: [...state.columns[column].cards, newCard]
          }
        }
      };
    }

    case "MOVE_CARD": {
      const { cardId, fromColumn, toColumn } = action.payload;
      
      const card = state.columns[fromColumn].cards.find(c => c.id === cardId);
      if (!card) return state;

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [fromColumn]: {
            ...state.columns[fromColumn],
            cards: state.columns[fromColumn].cards.filter(c => c.id !== cardId)
          },
          [toColumn]: {
            ...state.columns[toColumn],
            cards: [...state.columns[toColumn].cards, card]
          }
        }
      };

      return newState;
    }

    case "DELETE_CARD": {
      const { cardId, column } = action.payload;
      
      return {
        ...state,
        columns: {
          ...state.columns,
          [column]: {
            ...state.columns[column],
            cards: state.columns[column].cards.filter(c => c.id !== cardId)
          }
        }
      };
    }

    case "EDIT_CARD": {
      const { cardId, column, data } = action.payload;
      
      return {
        ...state,
        columns: {
          ...state.columns,
          [column]: {
            ...state.columns[column],
            cards: state.columns[column].cards.map(card =>
              card.id === cardId ? { ...card, ...data } : card
            )
          }
        }
      };
    }

    case "RESET_BOARD": {
      return initialState;
    }

    default:
      return state;
  }
}

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: "LOAD_STATE", payload: parsed });
      }
    } catch (error) {
      console.error("Failed to load board state from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save board state to localStorage:", error);
    }
  }, [state]);

  const addCard = (column, title, options = {}) => {
    if (!state.columns[column]) {
      console.error(`Invalid column: ${column}`);
      return;
    }
    
    dispatch({
      type: "ADD_CARD",
      payload: { column, title, ...options }
    });
  };

  const moveCard = (cardId, toColumn) => {
    let fromColumn = null;
    
    for (const colKey in state.columns) {
      if (state.columns[colKey].cards.some(c => c.id === cardId)) {
        fromColumn = colKey;
        break;
      }
    }

    if (!fromColumn) {
      console.error(`Card ${cardId} not found`);
      return;
    }

    if (!state.columns[toColumn]) {
      console.error(`Invalid target column: ${toColumn}`);
      return;
    }

    if (fromColumn === toColumn) {
      return;
    }

    dispatch({
      type: "MOVE_CARD",
      payload: { cardId, fromColumn, toColumn }
    });
  };

  const deleteCard = (cardId) => {
    let column = null;
    
    for (const colKey in state.columns) {
      if (state.columns[colKey].cards.some(c => c.id === cardId)) {
        column = colKey;
        break;
      }
    }

    if (!column) {
      console.error(`Card ${cardId} not found`);
      return;
    }

    dispatch({
      type: "DELETE_CARD",
      payload: { cardId, column }
    });
  };

  const editCard = (cardId, data) => {
    let column = null;
    
    for (const colKey in state.columns) {
      if (state.columns[colKey].cards.some(c => c.id === cardId)) {
        column = colKey;
        break;
      }
    }

    if (!column) {
      console.error(`Card ${cardId} not found`);
      return;
    }

    dispatch({
      type: "EDIT_CARD",
      payload: { cardId, column, data }
    });
  };

  const resetBoard = () => {
    dispatch({ type: "RESET_BOARD" });
  };

  const value = {
    columns: state.columns,
    addCard,
    moveCard,
    deleteCard,
    editCard,
    resetBoard
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
}

export default BoardContext;