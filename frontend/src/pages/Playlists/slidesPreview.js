import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import OpenWithIcon from '@mui/icons-material/OpenWith';

const DraggableSlide = ({ slide, index, currentSlide, onSelect, handleRemoveSlide }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: index });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      backgroundColor: slide.style.bgColor,
      position: "relative", // Ensures child elements (image, video) position correctly
    };
  
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={currentSlide == index ? "slide slideActive" : "slide"}
        onClick={() => onSelect(index)}
      >
        {/* Image or Video */}
        {slide.media?.mediaType == 1 && (
          <img
            src={`${process.env.REACT_APP_CDN_URL}${slide.media?.mediaUrl}`}
            alt="slide"
            style={{ width: "100%", height:'98%',objectFit: "contain", pointerEvents: "auto" }} // Ensure clicks pass through
          />
        )}
        {slide.media?.mediaType == 2 && (
          <video
            src={`${process.env.REACT_APP_CDN_URL}${slide.media?.mediaUrl}`}
            loading="lazy"
            onLoadedMetadata={(e) => (e.target.currentTime = 1)}
            controls
            style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "auto" }} // Ensure clicks pass through
          />
        )}
  
        {/* Drag Handle - Move listeners here */}
        <div
          {...attributes}
          {...listeners}
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            cursor: "grab",
            borderRadius: "5px",
            backgroundColor:"white",
            color: "white",
          }}
        >
          <IconButton
            title="Drag to reorder"
            sx={{
                cursor: "grab",
                width: 28,
                height: 24,
            }}
            >
            <OpenWithIcon />
            </IconButton>
        </div>
  
        {/* Remove Button */}
        <Chip
      sx={{position: "absolute", top: 4, right: 2,backgroundColor: "white",color: "black"}}
        label={index + 1}
        avatar={
            <IconButton title="Remove Slide" onClick={() => handleRemoveSlide(index)} >
            <DeleteIcon />
          </IconButton>}
        variant="outlined"
        />
      </div>
    );
  };
  

const SlidesManager = ({ slides, setSlides, currentSlide, setCurrentSlide,handleRemoveSlide }) => {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = slides.findIndex((_, i) => i === active.id);
    const newIndex = slides.findIndex((_, i) => i === over.id);

    setSlides(arrayMove(slides, oldIndex, newIndex));
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={slides.map((_, index) => index)} strategy={horizontalListSortingStrategy}>
        <div className="slides">
          {slides.map((slide, index) => (
            <DraggableSlide
              key={index}
              slide={slide}
              index={index}
              currentSlide={currentSlide}
              onSelect={setCurrentSlide}
              handleRemoveSlide={handleRemoveSlide}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SlidesManager;
