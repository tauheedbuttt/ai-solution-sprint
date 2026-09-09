import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, borderWidth, radius, type as t, space } from '../theme/tokens';
import { SheetHeader } from './sheetheader';
import { TextField } from './textfield';
import { api, type product } from '../services/api';

type props = {
  title: string;
  onClose: () => void;
  onSelect: (product: product) => void;
};

export function ProductListSearch({ title, onClose, onSelect }: props) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<product[]>([]);

  useEffect(() => {
    api.products.search(query).then(setProducts);
  }, [query]);

  return (
    <View style={styles.root}>
      <SheetHeader title={title} onClose={onClose} />
      <View style={styles.searchWrap}>
        <TextField placeholder="Search your products" value={query} onChangeText={setQuery} autoCapitalize="none" />
      </View>
      <ScrollView>
        {products.map((p) => (
          <Pressable key={p.id} style={styles.row} onPress={() => onSelect(p)}>
            <View style={styles.thumb}>
              <Ionicons name="image-outline" size={18} color={color.mutedForeground} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>{p.name}</Text>
              <Text style={styles.rowSubtitle}>{p.category}</Text>
            </View>
            <Text style={styles.rowBadge}>{p.status === 'draft' ? 'Draft' : p.careScore ? `Score ${p.careScore}` : ''}</Text>
          </Pressable>
        ))}
        {products.length === 0 ? <Text style={styles.empty}>No products match "{query}"</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  searchWrap: { padding: space.lg, paddingBottom: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: color.border,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: color.secondary,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1, gap: 2 },
  rowTitle: { ...t.body, color: color.foreground },
  rowSubtitle: { ...t.bodySmall, color: color.mutedForeground },
  rowBadge: { ...t.eyebrow, color: color.mint },
  empty: { ...t.bodySmall, color: color.mutedForeground, padding: space.lg },
});
