// SliderComponent.js
import React from 'react';
import Slider from 'react-slick';
import './carrousel.css';

// Importando imagens (exemplo)
import Item_1 from '../../assets/carrousel_item_1.png';
import Item_2 from '../../assets/carrousel_item_2.png';
import Item_3 from '../../assets/carrousel_item_3.png';

const SliderComponent = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div>
            <h2>Galeria de Fotos</h2>
            <Slider {...settings}>
                <div>
                    <img src={Item_1} alt="Item 1" />
                </div>
                <div>
                    <img src={Item_2} alt="Item 2" />
                </div>
                <div>
                    <img src={Item_3} alt="Item 3" />
                </div>
            </Slider>
        </div>
    );
};

export default SliderComponent;
