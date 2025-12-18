export const estilos = {
    table: {
        style: {
        },
    },
    tableWrapper: {
        style: {
            display: "table",
        },
    },
    responsiveWrapper: {
        style: {},
    },
    header: {
        style: {
            fontSize: "22px",
            minHeight: "56px",
            paddingLeft: "0px",
            paddingRight: "0px",
        },
    },
    subHeader: {
        style: {
            minHeight: "52px",
        },
    },
    head: {
        style: {
            fontSize: "14px",
            fontWeight: 500,
            minWidth: "0x",
            textAlign: "center",
        },
    },
    headRow: {
        style: {
            fontSize: '17px',
            minHeight: "50px",
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
        },
        denseStyle: {
            minHeight: "32px",
        },
    },
    headCells: {
        style: {
            paddingLeft: "0px",
            paddingRight: "0px",
            fontWeight: 700,
        },
        draggingStyle: {
            cursor: "move",
        },
    },
    contextMenu: {
        style: {
            fontSize: "18px",
            fontWeight: 400,
            paddingLeft: "16px",
            paddingRight: "8px",
            transform: 'translate3d(0, -100%, 0)',
            transitionDuration: '125ms',
            transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
            willChange: 'transform',
        },
        activeStyle: {
            transform: 'translate3d(0, 0, 0)',
        },
    },
    cells: {
        style: {
            paddingLeft: '0px',
            paddingRight: '0px',
            wordBreak: 'break-word',
            whiteSpace: 'nowrap',
        },
        draggingStyle: {},
    },
    rows: {
        style: {
            fontFamily: 'arial',
            fontSize: '14px',
            fontWeight: 0,
            minHeight: '35px',
            //width: '1200px',
            //maxWidth: '100%',
        '&:not(:last-of-type)': {
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
        },
    },
    denseStyle: {
        minHeight: "32px",
    },
    selectedHighlightStyle: {
        // use nth-of-type(n) to override other nth selectors
        '&:nth-of-type(n)': {
        },
    },
    highlightOnHoverStyle: {
        transitionDuration: '0.15s',
        transitionProperty: 'background-color',
        outlineStyle: 'solid',
        outlineWidth: '1px',
    },
    stripedStyle: {
    },
},
    expanderRow: {
        style: {
        },
    },
    expanderCell: {
        style: {
            flex: '0 0 48px',
        },
    },
    expanderButton: {
        style: {
            backgroundColor: 'transparent',
            borderRadius: '2px',
            transition: '0.25s',
            height: '100%',
            width: '100%',
            '&:hover:enabled': {
                cursor: 'pointer',
            },
            '&:disabled': {
            },
            '&:hover:not(:disabled)': {
                cursor: 'pointer',
            },
            '&:focus': {
                outline: 'none',
            },
            svg: {
                margin: 'auto',
            },
        },
    },
};