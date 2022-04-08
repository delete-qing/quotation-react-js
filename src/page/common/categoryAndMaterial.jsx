import React, { Component } from 'react';
import { Tag, Tooltip } from 'antd';
import $ from 'jquery'


class categoryAndMaterial extends Component {


    constructor(props) {
        super(props)
        this.state = {
            tech: props.parent,
        }
    }


    tree(event) {
        let $parentLi = $(event.target).closest('li.parent_li');

        let $li = $parentLi.find('ul > li');
        this.visible($li, 'fast');

        let $operate = $parentLi.find('.operate');
        this.visible($operate);

    }


    render() {
        const { tech } = this.state
        return (
            <div>
                <ul>
                    {tech.category_list.map((category, c) => (
                        <li style={{ display: 'none' }} className="parent_li" key={c}>
                            <Tag color="grey" onClick={this.tree}>
                                <div className="dib wEllipsis">
                                    <Tooltip placement="topLeft">
                                        <template slot="title">{category.name}</template>
                                        <span>{category.name}</span>
                                    </Tooltip>
                                </div>
                                {category.material_list.map((material, s) => {
                                    < ul >
                                        <li style={{ display: 'none' }} className="parent_li" key={s}>
                                            <Tag color="green" onClick={this.tree}>
                                                <div className="dib wEllipsis">
                                                    <Tooltip placement="topLeft" title={material.name}>
                                                        <span>{material.name}</span>
                                                    </Tooltip>
                                                </div>
                                            </Tag>
                                        </li>
                                    </ ul>
                                })
                                }
                            </Tag>
                        </li >
                    ))
                    }

                    {tech.material_list.map((material, s) => {
                        <li style={{ display: 'none' }} key={s}>
                            <Tag color="green" onClick={this.tree}>
                                <div className="dib wEllipsis">
                                    <Tooltip placement="topLeft" title={material.name}>
                                        <span>{material.name}</span>
                                    </Tooltip>
                                </div>
                            </Tag>

                        </li >
                    })}

                </ul >
            </div >
        );
    }
}

export default categoryAndMaterial;