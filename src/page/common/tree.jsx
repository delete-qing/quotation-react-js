import React, { Component } from 'react'
import { Tag, Tooltip } from 'antd';
import $ from 'jquery'

export default class extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tech: props.parent,
        }

    }

    tree(event) {
        let $parentLi = $(event.target).closest('li.parent_li');

        let $li = $parentLi.find('ul > li');

        if ($li.is(":visible")) {
            $li.hide('fast');
        } else {
            $li.show('fast');
        }

        let $operate = $parentLi.find('.operate');
        if ($operate.is(":visible")) {
            $operate.hide('fast');
        } else {
            $operate.show('fast');
        }
    }

    render() {
        const { tech } = this.state
        return (
            <div>

                <div className="tech-structure">
                    <Tag onClick={this.tree}>
                        <div className="dib wEllipsis">
                            <Tooltip placement="topLeft" title={tech.name}>
                                <span>{tech.name}</span>
                            </Tooltip>
                        </div>
                    </Tag>
                    <ul>
                        {tech.comsumable_list.map((comsumable, c) => (
                            <li className="parent_li" key={c}>
                                <Tag>
                                    <div className="dib wEllipsis">
                                        <span>{comsumable.comsumable_name}*{comsumable.quantity}</span>
                                    </div>
                                </Tag>
                            </li>
                        ))

                        }

                        {tech.mould_list.map((mould, m) => (
                            <li className="parent_li" key={m}>
                                <Tag>
                                    <div className="dib wEllipsis">
                                        <span>{mould.mould_name}</span>
                                    </div>
                                </Tag>
                            </li>
                        ))

                        }
                        {tech.options.map((option, w) => (
                            <li className="parent_li" key={w}>
                                <Tag>
                                    <div className="dib wEllipsis">
                                        <span>{option.option_name}</span>
                                    </div>
                                </Tag>
                            </li>
                        ))
                        }

                    </ul >
                </div >

            </div >
        )
    }
}
