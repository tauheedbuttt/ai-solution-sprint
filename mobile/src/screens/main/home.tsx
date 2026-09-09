import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, type as t, space } from "../../theme/tokens";
import { EventCarousel } from "../../components/eventcarousel";
import { CareScoreCard } from "../../components/carescorecard";
import { StatRow } from "../../components/statrow";
import { ProductCard } from "../../components/productcard";
import { ProductListSearch } from "../../components/productlistsearch";
import { Sheet } from "../../components/sheet";
import { ProductDetailScreen } from "./productdetail";
import { api, type event, type summary, type product } from "../../services/api";

export function HomeScreen() {
  const [events, setEvents] = useState<event[]>([]);
  const [summary, setSummary] = useState<summary>();
  const [products, setProducts] = useState<product[]>([]);
  const [openProduct, setOpenProduct] = useState<product | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    function load() {
      api.events.list().then(setEvents);
      api.stats.summary().then(setSummary);
      api.products.list().then(setProducts);
    }
    load();
    return api.subscribe(load);
  }, []);

  return (
    <>
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        {summary ? (
          <View style={styles.stats}>
            <CareScoreCard score={summary.careScore} note={summary.careScoreNote} />
            <StatRow
              stats={[
                { label: "Items", value: String(summary.itemsInLoop) },
                { label: "Events", value: String(summary.careEventsLogged) },
                { label: "In use", value: String(summary.stillInUse) },
                { label: "Months", value: `+${summary.monthsOfLifeAdded}`, valueColor: color.mint },
              ]}
            />
          </View>
        ) : null}

        <EventCarousel events={events} />

        <View style={styles.products}>
          <View style={styles.productsHeader}>
            <Text style={styles.productsTitle}>Products</Text>
            <Pressable style={styles.viewAll} onPress={() => setShowAllProducts(true)} hitSlop={8}>
              <Text style={styles.viewAllLabel}>View all</Text>
              <Ionicons name="chevron-forward" size={14} color={color.mutedForeground} />
            </Pressable>
          </View>
          <View style={styles.grid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onPress={() => setOpenProduct(p)} />
            ))}
          </View>
        </View>
      </ScrollView>

      <Sheet visible={!!openProduct} onClose={() => setOpenProduct(null)}>
        {openProduct ? <ProductDetailScreen product={openProduct} onClose={() => setOpenProduct(null)} /> : null}
      </Sheet>

      <Sheet visible={showAllProducts} onClose={() => setShowAllProducts(false)}>
        <ProductListSearch
          title="Products"
          onClose={() => setShowAllProducts(false)}
          onSelect={(p) => {
            setShowAllProducts(false);
            setOpenProduct(p);
          }}
        />
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  content: { paddingVertical: space.md, gap: space.lg },
  stats: { paddingHorizontal: space.lg, gap: space.sm },
  products: { paddingHorizontal: space.lg, gap: space.md },
  productsHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  productsTitle: { ...t.h3, color: color.foreground },
  viewAll: { flexDirection: "row", alignItems: "center", gap: 2 },
  viewAllLabel: { ...t.bodySmall, color: color.mutedForeground },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: space.md },
});
