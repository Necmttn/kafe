import { connectRefinementList } from 'react-instantsearch-dom';
import Select from 'react-select';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import DropdownIndicator from './DropdownIndicator';

const RefinementList = ({ items, refine, Control, customStyles }) => {
  const { theme } = useTheme();
  const innerTheme = theme;
  const [filteredItems, setFilteredItems] = useState('');

  const handleMenuChange = (options, meta) => {
    if (meta.action === 'clear' || options.length === 0) {
      refine([]);
      setFilteredItems('');
    } else {
      const filter = options.map(item => item.label);
      refine(filter);
      setFilteredItems(filter);
    }
  };
  return (
    <Select
      instanceId="tags"
      isMulti
      options={items}
      value={items.filter(item => filteredItems.includes(item.label))}
      components={{ Control, DropdownIndicator }}
      styles={customStyles}
      placeholder="select"
      onChange={handleMenuChange}
      theme={theme => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: innerTheme === 'dark' ? '#EB5F49' : '#9462F7',
          primary: 'none',
        },
      })}
    />
  );
};

export default connectRefinementList(RefinementList);
